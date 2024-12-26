import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WelcomeStep } from './steps/WelcomeStep';
import { ProfileStep } from './steps/ProfileStep';
import { SubjectsStep } from './steps/SubjectsStep';
import { GoalsStep } from './steps/GoalsStep';
import { CompletionStep } from './steps/CompletionStep';

export const OnboardingFlow = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    profilePicture: '',
    gradeLevel: '',
    subjects: [],
    learningGoals: []
  });

  const steps = [
    WelcomeStep,
    ProfileStep,
    SubjectsStep,
    GoalsStep,
    CompletionStep
  ];

  const CurrentStep = steps[step];

  const nextStep = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="max-w-2xl mx-auto px-4 py-8"
        >
          <CurrentStep
            data={formData}
            onNext={nextStep}
            onBack={prevStep}
            isFirst={step === 0}
            isLast={step === steps.length - 1}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};