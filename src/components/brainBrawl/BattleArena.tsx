import React, { useState, useEffect } from 'react';
import { Question, PlayerAnswer } from '../../types/brainBrawl';
import { Timer, Brain } from 'lucide-react';

interface BattleArenaProps {
  questions: Question[];
  onAnswer: (answer: PlayerAnswer) => void;
  onComplete: () => void;
  timeLimit: number; // in seconds
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  questions,
  onAnswer,
  onComplete,
  timeLimit
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(optionIndex);
    const timeSpent = (Date.now() - startTime) / 1000;
    
    onAnswer({
      questionId: questions[currentQuestionIndex].id,
      selectedOption: optionIndex,
      timeSpent
    });

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setStartTime(Date.now());
      } else {
        onComplete();
      }
    }, 1000);
  };

  const currentQuestion = questions[currentQuestionIndex];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Brain className="h-6 w-6 text-purple-600 mr-2" />
          <span className="text-lg font-semibold">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="flex items-center text-lg font-semibold">
          <Timer className="h-6 w-6 text-red-500 mr-2" />
          <span className={timeRemaining <= 30 ? 'text-red-500' : ''}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-medium mb-6">{currentQuestion.text}</h2>
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={selectedOption !== null}
              className={`
                w-full text-left p-4 rounded-lg border transition-all
                ${
                  selectedOption === null
                    ? 'hover:border-purple-500 hover:bg-purple-50'
                    : selectedOption === index
                      ? index === currentQuestion.correctAnswer
                        ? 'bg-green-100 border-green-500'
                        : 'bg-red-100 border-red-500'
                      : index === currentQuestion.correctAnswer
                        ? 'bg-green-100 border-green-500'
                        : 'bg-gray-50 border-gray-300'
                }
              `}
            >
              <span className="font-medium">{String.fromCharCode(65 + index)}.</span>{' '}
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center text-gray-600">
        {selectedOption !== null ? (
          <p>Next question in 1 second...</p>
        ) : (
          <p>Select your answer</p>
        )}
      </div>
    </div>
  );
}; 