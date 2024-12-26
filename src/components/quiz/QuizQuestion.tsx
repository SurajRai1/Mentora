import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

interface QuizQuestionProps {
  question: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
  onAnswer: (questionId: string, answer: string) => void;
  current: number;
  total: number;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  current,
  total,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
  }, [question.id]);

  const handleOptionClick = (option: string) => {
    if (isAnswered) return; // Prevent changing answer after selection
    setSelectedOption(option);
    setIsAnswered(true);
    onAnswer(question.id, option);
  };

  return (
    <motion.div
      key={question.id} // Add key to force re-render on question change
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-500">Question {current} of {total}</span>
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-600 transition-all duration-300"
            style={{ width: `${(current / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-6">
          {question.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === option;
            const optionLetter = option.charAt(0); // A, B, C, or D
            const optionText = option.slice(3); // Remove "X) " prefix

            return (
              <button
                key={`${question.id}-${index}`}
                onClick={() => handleOptionClick(option)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                  ${isSelected 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                  }
                  ${isAnswered && !isSelected ? 'opacity-50' : ''}
                  disabled:cursor-default group relative`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full 
                    border-2 transition-colors
                    ${isSelected
                      ? 'border-purple-500 bg-purple-500 text-white'
                      : 'border-gray-300 group-hover:border-purple-300'
                    }`}
                  >
                    <span className="text-sm font-medium">{optionLetter}</span>
                  </div>
                  <span className={`text-gray-900 group-hover:text-gray-900
                    ${isSelected ? 'font-medium' : ''}`}>
                    {optionText}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Question info */}
        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            <p>{isAnswered ? 'Answer submitted' : 'Select the best answer'}</p>
          </div>
          <span>{current}/{total}</span>
        </div>
      </div>
    </motion.div>
  );
};