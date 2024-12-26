import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, RefreshCw, Trophy, ChevronLeft, Share2 } from 'lucide-react';
import { Quiz } from '../../types';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../lib/firebase';
import { addDoc, collection } from 'firebase/firestore';

interface QuizResultsProps {
  quiz: Quiz;
  answers: Record<string, string>;
  onRetry: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ quiz, answers, onRetry }) => {
  const navigate = useNavigate();
  const correctAnswers = quiz.questions.filter(q => answers[q.id] === q.correctAnswer).length;
  const score = Math.round((correctAnswers / quiz.questions.length) * 100);

  useEffect(() => {
    const saveResults = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          await addDoc(collection(db, 'users', user.uid, 'quizResults'), {
            quizId: quiz.id,
            subject: quiz.subject,
            title: quiz.title,
            score,
            totalQuestions: quiz.questions.length,
            correctAnswers,
            timestamp: new Date().toISOString(),
            answers
          });
        } catch (error) {
          console.error('Error saving quiz results:', error);
        }
      }
    };

    saveResults();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excellent work! You\'ve mastered this topic! 🌟';
    if (score >= 70) return 'Great job! You\'re doing well! 👏';
    if (score >= 50) return 'Good effort! Keep practicing to improve! 💪';
    return 'Don\'t worry! Learning takes time. Try again! 🎯';
  };

  const handleShare = async () => {
    const text = `I just scored ${score}% on a ${quiz.subject} quiz! 🎓✨\nTest your knowledge too!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Quiz Results',
          text: text,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert('Results copied to clipboard!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Score Overview */}
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
        <div className="text-center max-w-lg mx-auto">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
          <div className={`text-5xl font-bold ${getScoreColor(score)} mb-4`}>{score}%</div>
          <p className="text-gray-600 mb-4">
            You got {correctAnswers} out of {quiz.questions.length} questions correct
          </p>
          <p className="text-gray-700 font-medium">
            {getScoreMessage(score)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-3 px-4 
                   rounded-lg hover:bg-purple-700 transition-colors min-w-[120px]"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 
                   rounded-lg hover:bg-blue-700 transition-colors min-w-[120px]"
        >
          <Share2 className="w-5 h-5" />
          Share Results
        </button>
        <button
          onClick={() => navigate('/quizzes')}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 
                   rounded-lg hover:bg-gray-200 transition-colors min-w-[120px]"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Quizzes
        </button>
      </div>

      {/* Question Review */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Question Review</h3>
        {quiz.questions.map((question, index) => {
          const isCorrect = answers[question.id] === question.correctAnswer;
          
          return (
            <div 
              key={question.id} 
              className={`bg-white rounded-lg p-6 shadow-sm border-l-4 ${
                isCorrect ? 'border-l-green-500' : 'border-l-red-500'
              } border-t border-r border-b border-gray-100`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {index + 1}. {question.question}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Your answer: <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {answers[question.id]}
                    </span>
                  </p>
                  {!isCorrect && (
                    <p className="text-sm text-gray-600 mb-2">
                      Correct answer: <span className="text-green-600 font-medium">
                        {question.correctAnswer}
                      </span>
                    </p>
                  )}
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{question.explanation}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};