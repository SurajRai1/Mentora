import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

interface GoalsStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const GOALS = [
  { id: 'improve_grades', text: 'Improve my grades 📈' },
  { id: 'test_prep', text: 'Prepare for tests 📝' },
  { id: 'learn_new', text: 'Learn new subjects 🎯' },
  { id: 'homework_help', text: 'Get homework help 📚' },
  { id: 'study_habits', text: 'Develop better study habits ⏰' },
  { id: 'college_prep', text: 'Prepare for college 🎓' }
];

export const GoalsStep: React.FC<GoalsStepProps> = ({ data, onNext, onBack }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(data.learningGoals || []);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleContinue = () => {
    onNext({ learningGoals: selectedGoals });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-10 h-10 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Set Your Goals 🎯</h2>
        <p className="text-gray-600 mt-2">What would you like to achieve?</p>
      </div>

      <div className="space-y-4 mb-8">
        {GOALS.map(goal => (
          <button
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
              selectedGoals.includes(goal.id)
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            {goal.text}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={selectedGoals.length === 0}
          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
};