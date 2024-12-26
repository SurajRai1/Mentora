import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';
import { generateQuiz } from '../../lib/quiz/quizGenerator';
import { useUserProfile } from '../../hooks/useUserProfile';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Quiz } from '../../types';

export const QuizSystem = () => {
  const { subject } = useParams();
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useUserProfile();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const generateNewQuiz = async () => {
    if (!subject) {
      navigate('/quizzes');
      return;
    }

    if (!profile?.gradeLevel) {
      setError('Please ensure your grade level is set in your profile.');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      setAnswers({});
      setCurrentQuestion(0);
      
      const newQuiz = await generateQuiz(subject, profile.gradeLevel);
      setQuiz(newQuiz);
      setRetryCount(0);
    } catch (error: any) {
      console.error('Error generating quiz:', error);
      setError(error.message || 'Failed to generate quiz. Please try again.');
      setRetryCount(prev => prev + 1);
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileLoading) return;
    
    if (!subject) {
      navigate('/quizzes');
      return;
    }

    if (!profile?.gradeLevel) {
      setError('Please ensure your grade level is set in your profile.');
      return;
    }

    generateNewQuiz();
  }, [subject, profile, profileLoading]);

  const handleAnswer = async (questionId: string, answer: string) => {
    if (!quiz) return;

    // Save the answer
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      }
    }, 750); // Increased delay for better UX
  };

  if (profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <div>
            <p className="text-red-500 font-medium mb-2">{error}</p>
            <p className="text-gray-600 mb-6">
              {retryCount >= 3 
                ? "We're having trouble generating your quiz. Please try again later or choose a different subject."
                : "Don't worry! Let's try generating another quiz."}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={generateNewQuiz}
              disabled={retryCount >= 3 || !profile?.gradeLevel}
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg 
                       hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={() => navigate('/quizzes')}
              className="px-6 py-2 text-gray-600 hover:text-gray-900"
            >
              Back to Subjects
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        <p className="text-gray-600">
          {isGenerating ? 'Generating your quiz...' : 'Loading...'}
        </p>
        <p className="text-sm text-gray-500">
          This may take a few moments
        </p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No quiz available. Please try selecting a subject again.</p>
        <button
          onClick={() => navigate('/quizzes')}
          className="text-purple-600 hover:text-purple-700"
        >
          Back to Subjects
        </button>
      </div>
    );
  }

  const isComplete = Object.keys(answers).length === quiz.questions.length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {!isComplete ? (
        <>
          <QuizQuestion
            question={quiz.questions[currentQuestion]}
            onAnswer={handleAnswer}
            total={quiz.questions.length}
            current={currentQuestion + 1}
          />
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => navigate('/quizzes')}
              className="text-gray-600 hover:text-gray-900"
            >
              Exit Quiz
            </button>
            <button
              onClick={generateNewQuiz}
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
            >
              <RefreshCw className="w-4 h-4" />
              Generate New Quiz
            </button>
          </div>
        </>
      ) : (
        <QuizResults
          quiz={quiz}
          answers={answers}
          onRetry={generateNewQuiz}
        />
      )}
    </div>
  );
};