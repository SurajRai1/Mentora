import React from 'react';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';

interface StudyStatsProps {
  stats: {
    totalSessions: number;
    lastWeekSessions: number;
    averageSessionsPerWeek: number;
  } | null;
}

export const StudyStats: React.FC<StudyStatsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Study Statistics</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="bg-purple-100 p-2 rounded-lg">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-500">Total Sessions</p>
            <p className="text-lg font-semibold text-gray-900">{stats.totalSessions}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-500">Last 7 Days</p>
            <p className="text-lg font-semibold text-gray-900">{stats.lastWeekSessions}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="bg-purple-100 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-500">Average Per Week</p>
            <p className="text-lg font-semibold text-gray-900">
              {stats.averageSessionsPerWeek}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};