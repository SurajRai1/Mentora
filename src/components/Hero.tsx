import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { AuthModal } from './auth/AuthModal';

export const Hero = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');

  const handleStartJourney = () => {
    setAuthMode('signup');
    setShowAuth(true);
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn with <span className="text-purple-600">Eliana</span>
            <Sparkles className="inline-block ml-2 text-yellow-400" />
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience personalized learning powered by adaptive AI technology
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartJourney}
            className="bg-purple-600 text-white px-8 py-3 rounded-full font-medium text-lg shadow-lg hover:bg-purple-700 transition-colors"
          >
            Start Your Journey
          </motion.button>
          <p className="mt-4 text-sm text-gray-500">
            Already have an account?{' '}
            <button
              onClick={() => {
                setAuthMode('signin');
                setShowAuth(true);
              }}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </div>

      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        initialMode={authMode}
      />
    </motion.section>
  );
};