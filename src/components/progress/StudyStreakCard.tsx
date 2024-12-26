import { Flame } from 'lucide-react';

interface StudyStreakProps {
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: string;
  };
}

export const StudyStreakCard = ({ streak }: StudyStreakProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-orange-500" />
        <h3 className="font-medium text-gray-900">Study Streak</h3>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-3xl font-bold text-orange-500">{streak.currentStreak}</p>
          <p className="text-sm text-gray-500">Current Streak</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-700">{streak.longestStreak}</p>
          <p className="text-sm text-gray-500">Longest Streak</p>
        </div>
      </div>
    </div>
  );
}; 