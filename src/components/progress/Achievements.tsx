import React from 'react';
import { useAchievements } from '../../hooks/useAchievements';
import { Trophy, Award, Lock } from 'lucide-react';

export const Achievements = () => {
  const { achievements, loading, error } = useAchievements();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        {error}
      </div>
    );
  }

  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const lockedAchievements = achievements.filter(a => !a.unlockedAt);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-medium text-gray-900">Achievements</h3>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Achievements"
          value={achievements.length}
          icon={Trophy}
        />
        <StatCard
          title="Unlocked"
          value={unlockedAchievements.length}
          icon={Award}
        />
        <StatCard
          title="Completion Rate"
          value={`${Math.round((unlockedAchievements.length / achievements.length) * 100)}%`}
          icon={Lock}
        />
      </div>

      {/* Unlocked Achievements */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Unlocked Achievements</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unlockedAchievements.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-gray-500">
              No achievements unlocked yet. Keep learning to earn achievements!
            </div>
          ) : (
            unlockedAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked
              />
            ))
          )}
        </div>
      </div>

      {/* Locked Achievements */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Available Achievements</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lockedAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              unlocked={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ 
  title, 
  value, 
  icon: Icon 
}: { 
  title: string; 
  value: number | string; 
  icon: any; 
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-purple-100 rounded-lg">
        <Icon className="w-6 h-6 text-purple-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const AchievementCard = ({ 
  achievement, 
  unlocked 
}: { 
  achievement: any; 
  unlocked: boolean; 
}) => {
  const categoryColors = {
    quiz: 'bg-blue-100 text-blue-800',
    study: 'bg-green-100 text-green-800',
    streak: 'bg-yellow-100 text-yellow-800',
    milestone: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 ${
      unlocked ? 'opacity-100' : 'opacity-70'
    }`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 bg-purple-100 rounded-lg">
          <span className="text-2xl">{achievement.icon}</span>
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h5 className="font-medium text-gray-900">{achievement.title}</h5>
              <p className="text-sm text-gray-500">{achievement.description}</p>
            </div>
            {unlocked ? (
              <Award className="w-5 h-5 text-yellow-500" />
            ) : (
              <Lock className="w-5 h-5 text-gray-400" />
            )}
          </div>

          <div className="mt-4 space-y-3">
            <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[achievement.category]}`}>
              {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
            </span>

            {!unlocked && (
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(achievement.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 rounded-full h-2 transition-all duration-300"
                    style={{ width: `${achievement.progress}%` }}
                  />
                </div>
              </div>
            )}

            {unlocked && achievement.unlockedAt && (
              <div className="text-sm text-gray-500">
                Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 