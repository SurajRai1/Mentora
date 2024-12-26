import React from 'react';
import { Clock, BookOpen, TrendingUp } from 'lucide-react';
import { SubjectProgress } from '../../types/progress';

interface SubjectProgressCardProps {
  progress: SubjectProgress;
}

export const SubjectProgressCard: React.FC<SubjectProgressCardProps> = ({ progress }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{progress.subject}</h3>
            <p className="text-sm text-gray-500">
              Last studied {new Date(progress.lastStudied).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            {Math.round(progress.totalTime / 60 * 10) / 10}h
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            {progress.averageRating.toFixed(1)}/5
          </div>
        </div>
      </div>

      {/* Topics */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Most Studied Topics</h4>
        <div className="space-y-2">
          {progress.topicsStudied.slice(0, 3).map(topic => (
            <div key={topic.topic} className="flex items-center justify-between">
              <p className="text-sm text-gray-600">{topic.topic}</p>
              <p className="text-sm text-gray-900 font-medium">
                {Math.round(topic.timeSpent / 60 * 10) / 10}h
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Chart */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-500">Weekly Progress</span>
          <span className="text-gray-900 font-medium">
            {progress.weeklyProgress[progress.weeklyProgress.length - 1]?.timeSpent || 0} mins
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 transition-all duration-300"
            style={{
              width: `${Math.min(
                (progress.weeklyProgress[progress.weeklyProgress.length - 1]?.timeSpent || 0) / 
                (Math.max(...progress.weeklyProgress.map(w => w.timeSpent)) || 1) * 100,
                100
              )}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}; 