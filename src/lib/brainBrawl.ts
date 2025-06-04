import OpenAI from 'openai';
import { Subject, GradeLevel, Question, Battle, PlayerAnswer, PlayerType } from '../types/brainBrawl';
import { db } from './firebase';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  Timestamp,
  deleteDoc,
  arrayUnion
} from 'firebase/firestore';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const MATCH_TIMEOUT = 5000; // 5 seconds before bot match
const BATTLE_CLEANUP_TIME = 300000; // 5 minutes

export const generateQuestions = async (
  subject: Subject,
  gradeLevel: GradeLevel
): Promise<Question[]> => {
  try {
    const prompt = `Generate 30 multiple-choice questions for a ${gradeLevel} student in ${subject}. 
    Each question should have 4 options with only one correct answer.
    Format the response as a JSON array of objects with the following structure:
    {
      "text": "question text",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0-3 (index of correct option)
    }
    Make sure the questions are challenging but appropriate for the grade level.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator specializing in creating engaging and accurate quiz questions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    if (!response.choices[0].message?.content) {
      throw new Error('Failed to generate questions: No response from AI');
    }

    const questionsData = JSON.parse(response.choices[0].message.content);
    
    if (!Array.isArray(questionsData) || questionsData.length !== 30) {
      throw new Error('Invalid question format received from AI');
    }

    return questionsData.map((q: any, index: number) => ({
      id: `q${index + 1}`,
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      subject,
      gradeLevel
    }));
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions. Please try again.');
  }
};

const cleanupAbandonedBattles = async () => {
  const battlesRef = collection(db, 'battles');
  const now = Date.now();
  
  // Find battles that haven't been updated in a while
  const oldBattles = await getDocs(
    query(
      battlesRef,
      where('lastUpdateTime', '<', now - BATTLE_CLEANUP_TIME)
    )
  );

  // Delete abandoned battles
  const deletePromises = oldBattles.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
};

const simulateBotAnswer = (question: Question): PlayerAnswer => {
  // Bot has 80% chance of getting the answer right
  const isCorrect = Math.random() < 0.8;
  const selectedOption = isCorrect ? question.correctAnswer : 
    Math.floor(Math.random() * 4);
  
  return {
    questionId: question.id,
    selectedOption,
    timeSpent: Math.random() * 3 + 1 // Random time between 1-4 seconds
  };
};

const createBotBattle = async (
  playerId: string,
  subject: Subject,
  gradeLevel: GradeLevel
): Promise<string> => {
  const questions = await generateQuestions(subject, gradeLevel);
  
  const battle = await addDoc(collection(db, 'battles'), {
    player1Id: playerId,
    player2Id: 'bot',
    player2Type: 'bot' as PlayerType,
    subject,
    gradeLevel,
    state: 'matched',
    questions,
    player1Answers: [],
    player2Answers: [],
    startTime: Date.now(),
    lastUpdateTime: Date.now(),
    searchStartTime: Date.now()
  });

  // Simulate bot answers with delays
  questions.forEach((question, index) => {
    setTimeout(() => {
      const botAnswer = simulateBotAnswer(question);
      updateDoc(doc(db, 'battles', battle.id), {
        player2Answers: arrayUnion(botAnswer),
        lastUpdateTime: Date.now()
      });
    }, (index + 1) * 2000); // Bot answers every 2 seconds
  });

  return battle.id;
};

export const createBattle = async (
  player1Id: string,
  subject: Subject,
  gradeLevel: GradeLevel
) => {
  try {
    await cleanupAbandonedBattles();

    // First, try to find a match with exact criteria
    const exactMatch = await findMatch(player1Id, subject, gradeLevel);
    if (exactMatch) {
      return exactMatch;
    }

    // If no exact match, create a new battle
    const newBattle = await addDoc(collection(db, 'battles'), {
      player1Id,
      player2Id: '',
      player2Type: 'human' as PlayerType,
      subject,
      gradeLevel,
      state: 'waiting',
      player1Answers: [],
      player2Answers: [],
      startTime: null,
      questions: [],
      lastUpdateTime: Date.now(),
      searchStartTime: Date.now()
    });

    // Set up a timeout for bot match
    setTimeout(async () => {
      try {
        const battleRef = doc(db, 'battles', newBattle.id);
        const battleSnap = await getDoc(battleRef);
        
        if (battleSnap.exists() && battleSnap.data().state === 'waiting') {
          console.log('No human opponent found, starting bot match');
          const questions = await generateQuestions(subject, gradeLevel);
          await updateDoc(battleRef, {
            player2Id: 'bot',
            player2Type: 'bot',
            state: 'matched',
            questions,
            startTime: Date.now(),
            lastUpdateTime: Date.now()
          });

          // Start bot answers simulation
          questions.forEach((question, index) => {
            setTimeout(() => {
              const botAnswer = simulateBotAnswer(question);
              updateDoc(battleRef, {
                player2Answers: arrayUnion(botAnswer),
                lastUpdateTime: Date.now()
              });
            }, (index + 1) * 2000); // Bot answers every 2 seconds
          });
        }
      } catch (error) {
        console.error('Error creating bot match:', error);
      }
    }, MATCH_TIMEOUT);

    return { battleId: newBattle.id, isNewBattle: true };
  } catch (error) {
    console.error('Error creating/joining battle:', error);
    // Try to create a bot match immediately if battle creation fails
    try {
      console.log('Attempting to create bot match after error');
      const botBattleId = await createBotBattle(player1Id, subject, gradeLevel);
      return { battleId: botBattleId, isNewBattle: true };
    } catch (botError) {
      console.error('Error creating bot match:', botError);
      throw new Error('Failed to create battle. Please try again.');
    }
  }
};

const findMatch = async (
  playerId: string,
  subject: Subject,
  gradeLevel: GradeLevel
) => {
  const waitingBattlesRef = collection(db, 'battles');
  
  try {
    // Simplified query to only check waiting state and player2Type
    const q = query(
      waitingBattlesRef,
      where('state', '==', 'waiting'),
      where('player2Type', '==', 'human')
    );

    const waitingBattles = await getDocs(q);
    
    for (const battle of waitingBattles.docs) {
      const battleData = battle.data();
      
      if (battleData.player1Id !== playerId) {
        const questions = await generateQuestions(subject, gradeLevel);
        
        await updateDoc(doc(db, 'battles', battle.id), {
          player2Id: playerId,
          state: 'matched',
          questions,
          startTime: Date.now(),
          lastUpdateTime: Date.now()
        });
        
        return { battleId: battle.id, isNewBattle: false };
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding match:', error);
    // Instead of throwing error, return null to allow bot match creation
    return null;
  }
};

export const listenToBattle = (
  battleId: string,
  callback: (battle: Battle | null) => void
): (() => void) => {
  const battleRef = doc(db, 'battles', battleId);
  
  const unsubscribe = onSnapshot(
    battleRef,
    (doc) => {
      if (doc.exists()) {
        const battleData = doc.data() as Battle;
        callback({ ...battleData, id: doc.id });

        // Update lastUpdateTime
        updateDoc(battleRef, {
          lastUpdateTime: Date.now()
        }).catch(console.error);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error listening to battle:', error);
      callback(null);
    }
  );

  return unsubscribe;
};

export const submitAnswer = async (
  battleId: string,
  playerId: string,
  answer: {
    questionId: string;
    selectedOption: number;
    timeSpent: number;
  }
) => {
  try {
    const battleRef = doc(db, 'battles', battleId);
    const battle = await getDoc(battleRef);
    const battleData = battle.data() as Battle;

    if (!battleData) {
      throw new Error('Battle not found');
    }

    if (battleData.state !== 'matched' && battleData.state !== 'in-progress') {
      throw new Error('Battle is not in progress');
    }

    const isPlayer1 = playerId === battleData.player1Id;
    const answersField = isPlayer1 ? 'player1Answers' : 'player2Answers';

    // Update battle state to in-progress if it's the first answer
    if (battleData.state === 'matched') {
      await updateDoc(battleRef, { 
        state: 'in-progress',
        lastUpdateTime: Date.now()
      });
    }

    await updateDoc(battleRef, {
      [answersField]: [...battleData[answersField], answer],
      lastUpdateTime: Date.now()
    });

    // Check if both players have completed
    const player1Complete = battleData.player1Answers.length === battleData.questions.length;
    const player2Complete = battleData.player2Answers.length === battleData.questions.length;

    if (player1Complete && player2Complete) {
      // Calculate results
      const player1Score = calculateScore(battleData.player1Answers, battleData.questions);
      const player2Score = calculateScore(battleData.player2Answers, battleData.questions);

      const result = {
        winnerId: player1Score > player2Score ? battleData.player1Id : 
                  player2Score > player1Score ? battleData.player2Id : 'tie',
        player1Score,
        player2Score,
        timeRemaining: Math.max(300 - (Date.now() - battleData.startTime) / 1000, 0)
      };

      await updateDoc(battleRef, {
        state: 'completed',
        endTime: Date.now(),
        result,
        lastUpdateTime: Date.now()
      });

      return result;
    }
  } catch (error) {
    console.error('Error submitting answer:', error);
    throw new Error('Failed to submit answer. Please try again.');
  }
};

const calculateScore = (answers: any[], questions: Question[]) => {
  return answers.reduce((score, answer) => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question && question.correctAnswer === answer.selectedOption) {
      score += 1;
    }
    return score;
  }, 0);
}; 
