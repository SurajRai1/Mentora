import { openai, validateOpenAIConfig } from '../openai';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface UserContext {
  gradeLevel?: string;
  subjects?: string[];
  learningGoals?: string;
}

const MAX_CONTEXT_MESSAGES = 10;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const createSystemPrompt = (context: UserContext): string => `You are Eliana, a friendly and knowledgeable AI tutor with expertise in multiple subjects. You specialize in providing clear, engaging explanations and personalized learning support.

Student Context:
${context.gradeLevel ? `- Grade Level: ${context.gradeLevel}` : ''}
${context.subjects?.length ? `- Subjects: ${context.subjects.join(', ')}` : ''}
${context.learningGoals ? `- Learning Goals: ${context.learningGoals}` : ''}

Your Core Traits:
1. Friendly and approachable - use emojis and warm language
2. Patient and encouraging - celebrate progress and effort
3. Clear and structured - break down complex topics
4. Interactive - ask questions to check understanding
5. Adaptable - match explanations to student level

Response Guidelines:
1. Start responses with a friendly acknowledgment
2. Use markdown formatting for clarity:
   - **Bold** for key concepts
   - \`code\` for technical terms
   - Math equations using $...$ for inline and $$...$$ for display
   - Code blocks with proper syntax highlighting
3. Break down complex explanations into steps
4. Include relevant examples and analogies
5. End with a question or next step to maintain engagement

Remember to:
- Keep explanations grade-appropriate
- Use positive reinforcement
- Provide step-by-step solutions
- Include practice problems when relevant
- Make learning fun and engaging`;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateResponse = async (
  message: string,
  userContext: UserContext,
  previousMessages: { role: string; content: string; }[] = []
): Promise<string> => {
  try {
    // Validate OpenAI configuration
    validateOpenAIConfig();

    // Validate input message
    if (!message.trim()) {
      throw new Error('Message cannot be empty');
    }

    // Format previous messages and limit context window
    const formattedPrevMessages = previousMessages
      .slice(-MAX_CONTEXT_MESSAGES)
      .map(msg => ({
        role: msg.role === 'ai' ? 'assistant' : msg.role,
        content: msg.content
      }));

    // Prepare messages array with system prompt
    const messages: Message[] = [
      { role: 'system', content: createSystemPrompt(userContext) },
      ...formattedPrevMessages,
      { role: 'user', content: message }
    ];

    // Implement retry logic
    let lastError: Error | null = null;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages,
          temperature: 0.7,
          max_tokens: 1000,
          presence_penalty: 0.6,
          frequency_penalty: 0.5,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error('Empty response from AI');
        }

        return content;
      } catch (error: any) {
        lastError = error;
        
        // Handle rate limits with exponential backoff
        if (error.response?.status === 429) {
          const delay = RETRY_DELAY * Math.pow(2, attempt);
          await sleep(delay);
          continue;
        }
        
        // Break immediately for auth errors
        if (error.response?.status === 401) {
          throw new Error('Invalid API key. Please check your OpenAI configuration.');
        }
        
        // Break immediately for invalid requests
        if (error.response?.status === 400) {
          throw new Error('Invalid request. Please try again with a different message.');
        }
        
        // Wait before retrying other errors
        await sleep(RETRY_DELAY);
      }
    }

    // If all retries failed, throw the last error
    throw lastError || new Error('Failed to generate response after multiple attempts');
  } catch (error: any) {
    console.error('Error in generateResponse:', error);
    
    // Format user-friendly error messages
    if (error.response?.status === 429) {
      throw new Error('The AI is currently busy. Please try again in a moment.');
    }
    
    if (error.response?.status === 500) {
      throw new Error('The AI service is temporarily unavailable. Please try again later.');
    }
    
    if (error.message.includes('API key')) {
      throw new Error('There was a problem with the AI configuration. Please contact support.');
    }

    throw new Error(error.message || 'Failed to get response. Please try again.');
  }
};

// Helper function to validate message
export const validateMessage = (message: string): boolean => {
  const trimmed = message.trim();
  return trimmed.length > 0 && trimmed.length <= 2000;
}; 
