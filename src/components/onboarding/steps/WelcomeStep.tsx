import React from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
  isFirst: boolean;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <motion.div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <Rocket className="w-10 h-10 text-purple-600" />
      </motion.div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Your Learning Journey! 🚀
      </h1>
      
      <p className="text-xl text-gray-600 mb-8">
        Let's personalize your experience and help you achieve your learning goals.
      </p>

      <button
        onClick={onNext}
        className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-purple-700 transition-colors"
      >
        Let's Get Started
      </button>
    </motion.div>
  );
};