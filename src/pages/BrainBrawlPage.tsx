import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { Subject, GradeLevel, Battle, BattleState } from '../types/brainBrawl';
import { Brain, Timer, Trophy, AlertCircle } from 'lucide-react';
import { createBattle, listenToBattle, submitAnswer } from '../lib/brainBrawl';
import { BattleArena } from '../components/brainBrawl/BattleArena';

export const BrainBrawlPage: React.FC = () => {
  console.log('Rendering BrainBrawlPage');

  const [user] = useAuthState(auth);
  console.log('Current user:', user);

  const [selectedSubject, setSelectedSubject] = useState<Subject>('Mix of All Subjects');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('High School');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [battle, setBattle] = useState<Battle | null>(null);
  const [battleState, setBattleState] = useState<BattleState>('waiting');
  const [searchTimer, setSearchTimer] = useState<number | null>(null);

  const subjects: Subject[] = [
    'Mathematics',
    'Science',
    'Computer Science',
    'History',
    'Music',
    'General Knowledge',
    'Economics',
    'Mix of All Subjects'
  ];

  const gradeLevels: GradeLevel[] = [
    'High School',
    'Senior High School',
    'Undergraduate',
    'Graduate'
  ];

  // Cleanup function for battle listener
  useEffect(() => {
    console.log('Setting up battle listener cleanup');
    let unsubscribe: (() => void) | undefined;

    return () => {
      console.log('Cleaning up battle listener');
      if (unsubscribe) {
        unsubscribe();
      }
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
    };
  }, [searchTimer]);

  const handleStartBattle = async () => {
    if (!user) return;
    
    try {
      console.log('Starting battle with:', { selectedSubject, selectedGrade });
      setError(null);
      setIsSearching(true);
      
      const { battleId, isNewBattle } = await createBattle(
        user.uid,
        selectedSubject,
        selectedGrade
      );
      console.log('Battle created:', { battleId, isNewBattle });

      // Set up real-time listener for battle updates
      const unsubscribe = listenToBattle(battleId, (updatedBattle) => {
        console.log('Battle updated:', updatedBattle);
        if (!updatedBattle) {
          setError('Battle not found');
          setIsSearching(false);
          return;
        }

        setBattle(updatedBattle);
        setBattleState(updatedBattle.state);

        if (updatedBattle.state === 'matched') {
          setIsSearching(false);
          // Clear search timer if it exists
          if (searchTimer) {
            clearTimeout(searchTimer);
            setSearchTimer(null);
          }
        }
      });

      return unsubscribe;
    } catch (err) {
      console.error('Error in handleStartBattle:', err);
      setError(err instanceof Error ? err.message : 'Failed to start battle');
      setIsSearching(false);
    }
  };

  const handleAnswer = async (answer: any) => {
    if (!battle || !user) return;
    
    try {
      await submitAnswer(battle.id, user.uid, answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer');
    }
  };

  const handleBattleComplete = () => {
    setBattleState('completed');
  };

  // Show battle arena if a match is found
  if (battle && battleState === 'matched') {
    const isAgainstBot = battle.player2Type === 'bot';
    return (
      <div>
        {isAgainstBot && (
          <div className="max-w-3xl mx-auto mb-4 p-4 bg-blue-50 text-blue-700 rounded-lg">
            <p className="text-center">
              No human opponents found. You are playing against an AI opponent!
            </p>
          </div>
        )}
        <BattleArena
          questions={battle.questions}
          onAnswer={handleAnswer}
          onComplete={handleBattleComplete}
          timeLimit={300} // 5 minutes
        />
      </div>
    );
  }

  // Show battle results if completed
  if (battle && battleState === 'completed' && battle.result) {
    const isAgainstBot = battle.player2Type === 'bot';
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Battle Results</h2>
          {isAgainstBot && (
            <p className="text-center text-blue-600 mb-4">
              This was a practice battle against an AI opponent
            </p>
          )}
          <div className="text-center">
            <div className="text-xl mb-4">
              {battle.result.winnerId === user?.uid ? (
                <div className="text-green-600">You Won! 🎉</div>
              ) : battle.result.winnerId === 'tie' ? (
                <div className="text-yellow-600">It's a Tie! 🤝</div>
              ) : (
                <div className="text-red-600">You Lost! 😔</div>
              )}
            </div>
            <div className="space-y-2">
              <p>Your Score: {battle.result.player1Score}/30</p>
              <p>
                {isAgainstBot ? "AI's Score" : "Opponent's Score"}: 
                {battle.result.player2Score}/30
              </p>
              <p>Time Remaining: {Math.round(battle.result.timeRemaining)}s</p>
            </div>
            <button
              onClick={() => {
                setBattle(null);
                setBattleState('waiting');
                setIsSearching(false);
              }}
              className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Start New Battle
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <Brain className="h-10 w-10 text-purple-600 mr-3" />
          Brain Brawl
        </h1>
        <p className="text-lg text-gray-600">Challenge your knowledge in a 1v1 battle!</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Battle Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value as Subject)}
                  disabled={isSearching}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Level
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value as GradeLevel)}
                  disabled={isSearching}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                >
                  {gradeLevels.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Battle Rules</h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-center">
                <Timer className="h-5 w-5 text-purple-600 mr-2" />
                <span>5 minutes time limit</span>
              </div>
              <div className="flex items-center">
                <Trophy className="h-5 w-5 text-purple-600 mr-2" />
                <span>30 questions to answer</span>
              </div>
              <div className="flex items-center">
                <Brain className="h-5 w-5 text-purple-600 mr-2" />
                <span>AI-generated questions based on your settings</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleStartBattle}
            disabled={isSearching || !user}
            className={`
              px-6 py-3 rounded-lg text-white font-medium
              ${isSearching
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'}
            `}
          >
            {isSearching ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span>Finding Opponent...</span>
              </div>
            ) : (
              'Start Battle'
            )}
          </button>
          {!user && (
            <p className="mt-2 text-sm text-red-500">
              Please sign in to participate in Brain Brawl
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 