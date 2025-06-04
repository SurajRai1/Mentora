import OpenAI from 'openai';
import { Quiz } from '../../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const QUIZ_SYSTEM_PROMPT = `You are an expert educational quiz generator. Create engaging, accurate, and grade-appropriate questions.
Each time you're asked, generate completely unique questions, avoiding repetition.

Guidelines:
1. Questions should be clear, unambiguous, and UNIQUE
2. All options should be plausible but only one should be correct
3. Explanations should be concise and educational
4. Difficulty should match the grade level
5. Use proper formatting and grammar
6. Include a mix of:
   - Recall questions (testing memory of facts)
   - Understanding questions (testing comprehension)
   - Application questions (testing practical use)
   - Analysis questions (testing critical thinking)
7. Format options consistently:
   - Always use A) B) C) D) format
   - Keep options similar in length
   - Avoid "all/none of the above"
8. Provide clear, educational explanations that:
   - Explain why the correct answer is right
   - Point out common misconceptions
   - Connect to broader concepts
9. Ensure variety:
   - Cover different subtopics within the subject
   - Use different question formats
   - Vary the complexity of questions
   - Include real-world applications`;

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateQuiz = async (subject: string, gradeLevel: string): Promise<Quiz> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Validate inputs
      if (!subject || !gradeLevel) {
        throw new Error('Subject and grade level are required');
      }

      const timestamp = new Date().toISOString();
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: QUIZ_SYSTEM_PROMPT
          },
          {
            role: "user",
            content: `Create a unique quiz about ${subject} appropriate for ${gradeLevel} level with exactly 10 multiple choice questions.
            Make sure the questions are different from any previous ones. Current timestamp: ${timestamp}
            
Requirements:
- Title should be specific to the topic
- Each question must have exactly 4 options labeled A) B) C) D)
- One and only one correct answer per question
- Brief but clear explanation for the correct answer
- Questions should cover different aspects of ${subject}
- Difficulty should be appropriate for ${gradeLevel}
- Questions must be unique and not repeated
- Include real-world applications and examples
- Mix theoretical and practical questions

Format the response as a JSON object with this structure:
{
  "title": "Specific Quiz Title",
  "questions": [
    {
      "question": "Clear question text",
      "options": [
        "A) First option",
        "B) Second option",
        "C) Third option",
        "D) Fourth option"
      ],
      "correctAnswer": "A) First option",
      "explanation": "Clear explanation why this is correct"
    }
  ]
}`
          }
        ],
        temperature: 0.9, // Increased for more variety
        max_tokens: 4000,
        response_format: { type: "json_object" }
      });

      let quizData;
      try {
        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error('Empty response from OpenAI');
        }
        quizData = JSON.parse(content);
      } catch (error) {
        console.error('Error parsing quiz JSON:', error);
        throw new Error('Failed to generate a valid quiz format. Please try again.');
      }

      // Validate quiz structure
      if (!quizData || !quizData.title || !Array.isArray(quizData.questions)) {
        throw new Error('Invalid quiz format: missing required fields');
      }

      if (quizData.questions.length !== 10) {
        throw new Error('Invalid quiz format: incorrect number of questions');
      }

      // Validate each question
      quizData.questions.forEach((q: any, index: number) => {
        // Check required fields
        if (!q.question || !Array.isArray(q.options) || !q.correctAnswer || !q.explanation) {
          throw new Error(`Invalid question format at question ${index + 1}: missing required fields`);
        }

        // Validate options
        if (q.options.length !== 4) {
          throw new Error(`Invalid question format at question ${index + 1}: must have exactly 4 options`);
        }

        // Validate option format
        if (!q.options.every((opt: string) => /^[A-D]\)/.test(opt))) {
          throw new Error(`Invalid option format at question ${index + 1}: options must start with A), B), C), or D)`);
        }

        // Validate correct answer
        if (!q.options.includes(q.correctAnswer)) {
          throw new Error(`Invalid question format at question ${index + 1}: correct answer not found in options`);
        }
      });

      // Check for duplicate questions
      const questions = new Set(quizData.questions.map((q: any) => q.question.toLowerCase().trim()));
      if (questions.size !== quizData.questions.length) {
        throw new Error('Quiz contains duplicate questions');
      }

      // Create the quiz object with timestamp
      const quiz: Quiz = {
        id: crypto.randomUUID(),
        title: quizData.title,
        subject,
        difficulty: getDifficultyForGradeLevel(gradeLevel),
        questions: quizData.questions.map(q => ({
          id: crypto.randomUUID(),
          ...q
        })),
        timestamp: timestamp // Add timestamp to track when the quiz was generated
      };

      return quiz;
    } catch (error: any) {
      console.error(`Error generating quiz (attempt ${attempt + 1}):`, error);
      lastError = error;

      // Handle specific API errors
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI configuration.');
      }
      if (error.response?.status === 429) {
        const delay = RETRY_DELAY * Math.pow(2, attempt);
        await sleep(delay);
        continue;
      }
      if (error.response?.status === 500) {
        throw new Error('OpenAI service error. Please try again later.');
      }

      // Wait before retrying
      if (attempt < MAX_RETRIES - 1) {
        await sleep(RETRY_DELAY * Math.pow(2, attempt));
        continue;
      }
    }
  }

  // If all retries failed, throw a user-friendly error
  throw new Error(
    lastError?.message || 'Unable to generate quiz at this time. Please try again later.'
  );
};

const getDifficultyForGradeLevel = (gradeLevel: string): 'easy' | 'medium' | 'hard' => {
  const level = gradeLevel.toLowerCase();
  if (level.includes('elementary')) return 'easy';
  if (level.includes('middle')) return 'medium';
  return 'hard';
};

export const checkAnswer = async (
  question: string, 
  userAnswer: string, 
  correctAnswer: string
): Promise<boolean> => {
  try {
    // First try exact match (faster and more reliable for multiple choice)
    if (userAnswer.trim() === correctAnswer.trim()) {
      return true;
    }

    // If not exact match, use AI to check for semantic equivalence
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a precise quiz grader. Compare answers exactly and respond only with 'true' or 'false'."
        },
        {
          role: "user",
          content: `Question: ${question}\nCorrect Answer: ${correctAnswer}\nUser Answer: ${userAnswer}\nAre these answers equivalent? Respond with only 'true' or 'false'.`
        }
      ],
      temperature: 0,
      max_tokens: 5
    });

    const result = response.choices[0].message.content?.toLowerCase().trim();
    return result === 'true';
  } catch (error) {
    console.error('Error checking answer:', error);
    // Fall back to exact match if AI check fails
    return userAnswer.trim() === correctAnswer.trim();
  }
};
