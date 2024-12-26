import React from 'react';
import { useParams } from 'react-router-dom';
import { QuizSystem } from '../components/quiz/QuizSystem';

export const QuizPage = () => {
  const { subject } = useParams();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {subject} Quiz
        </h1>
        <p className="text-gray-600">
          Answer the following questions to test your knowledge.
        </p>
      </div>
      
      <QuizSystem />
    </div>
  );
};