import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface SubjectsStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const SUBJECTS = [
  { id: 'math', name: 'Mathematics', icon: '📐' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'english', name: 'English', icon: '📚' },
  { id: 'history', name: 'History', icon: '🏛️' },
  { id: 'cs', name: 'Computer Science', icon: '💻' },
  { id: 'art', name: 'Arts', icon: '🎨' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'language', name: 'Languages', icon: '🌎' }
];

export const SubjectsStep: React.FC<SubjectsStepProps> = ({ data, onNext, onBack }) => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(data.subjects || []);

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleContinue = () => {
    onNext({ subjects: selectedSubjects });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-10 h-10 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">What do you want to learn? 🧠</h2>
        <p className="text-gray-600 mt-2">Choose the subjects you're interested in</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {SUBJECTS.map(subject => (
          <button
            key={subject.id}
            onClick={() => toggleSubject(subject.id)}
            className={`p-4 rounded-lg border-2 transition-colors ${
              selectedSubjects.includes(subject.id)
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="text-2xl mb-2">{subject.icon}</div>
            <div className="font-medium">{subject.name}</div>
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
          disabled={selectedSubjects.length === 0}
          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
};