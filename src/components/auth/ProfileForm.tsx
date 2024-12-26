import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ProfileFormProps {
  onSubmit: (data: any) => void;
  initialData?: {
    firstName: string;
    lastName: string;
    schoolName: string;
    gradeLevel: string;
    subjects: string[];
    learningGoals: string;
  };
  submitLabel?: string;
}

const GRADE_LEVELS = [
  'Elementary School',
  'Middle School',
  'High School',
  'Undergraduate',
  'Graduate',
  'Other'
];

const SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Computer Science',
  'Foreign Languages',
  'Arts',
  'Other'
];

export const ProfileForm: React.FC<ProfileFormProps> = ({ 
  onSubmit, 
  initialData,
  submitLabel = "Complete Profile" 
}) => {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    schoolName: initialData?.schoolName || '',
    gradeLevel: initialData?.gradeLevel || '',
    subjects: initialData?.subjects || [] as string[],
    learningGoals: initialData?.learningGoals || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.subjects.length === 0) {
      alert('Please select at least one subject');
      return;
    }
    onSubmit(formData);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-6 max-h-[80vh] overflow-y-auto px-2 sm:px-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-sm sm:text-base focus:border-purple-500 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-sm sm:text-base focus:border-purple-500 focus:ring-purple-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">School Name</label>
        <input
          type="text"
          name="schoolName"
          value={formData.schoolName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-sm sm:text-base focus:border-purple-500 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Grade Level</label>
        <select
          name="gradeLevel"
          value={formData.gradeLevel}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-sm sm:text-base focus:border-purple-500 focus:ring-purple-500"
          required
        >
          <option value="">Select Grade Level</option>
          {GRADE_LEVELS.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subjects <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500 mb-2">Select at least one subject</p>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
          {SUBJECTS.map(subject => (
            <button
              key={subject}
              type="button"
              onClick={() => handleSubjectChange(subject)}
              className={`p-2 rounded-lg border-2 text-xs sm:text-sm ${
                formData.subjects.includes(subject)
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
        {formData.subjects.length === 0 && (
          <p className="mt-2 text-sm text-red-500">Please select at least one subject</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Learning Goals</label>
        <textarea
          name="learningGoals"
          value={formData.learningGoals}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-sm sm:text-base focus:border-purple-500 focus:ring-purple-500"
          rows={4}
          placeholder="What do you want to achieve?"
          required
        />
      </div>

      <div className="sticky bottom-0 bg-white py-3 sm:py-4">
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
        >
          {submitLabel}
        </button>
      </div>
    </motion.form>
  );
};