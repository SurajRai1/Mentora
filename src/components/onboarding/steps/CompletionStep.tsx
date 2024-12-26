import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface CompletionStepProps {
  data: any;
  isLast: boolean;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({ data }) => {
  const navigate = useNavigate();

  const handleComplete = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Ensure data matches User interface
      const userData = {
        id: user.uid,
        email: user.email || '',
        firstName: data.firstName,
        lastName: data.lastName,
        schoolName: data.schoolName,
        gradeLevel: data.gradeLevel,
        subjects: data.subjects,
        learningGoals: data.learningGoals,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      // Add error handling UI
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <CheckCircle className="w-10 h-10 text-purple-600" />
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        You're All Set! 🎉
      </h2>

      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Your learning journey is about to begin. We've personalized everything based on your preferences.
      </p>

      <button
        onClick={handleComplete}
        className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-purple-700 transition-colors"
      >
        Start Learning
      </button>
    </motion.div>
  );
};