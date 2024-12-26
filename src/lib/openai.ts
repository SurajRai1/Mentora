import OpenAI from 'openai';

// Create a singleton instance of OpenAI
export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Validate OpenAI configuration
export const validateOpenAIConfig = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('OpenAI API key is not configured');
  }
  
  // Validate API key format
  if (!apiKey.startsWith('sk-')) {
    throw new Error('Invalid OpenAI API key format');
  }
  
  return true;
};