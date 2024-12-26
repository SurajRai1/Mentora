import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  TrendingUp,
  Award,
  Target,
  BookOpen,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { ProgressChart } from './ProgressChart';
import { SubjectProgressCard } from './SubjectProgressCard';
import { StudyStreakCard } from './StudyStreakCard';
import { InsightCard } from './InsightCard';
import { RecommendationsList } from './RecommendationsList';

export const LearningAnalyticsDashboard = () => {
  const {
    stats,
    streak,
    subjectProgress,
    insights,
    recommendations,
    loading,
    error
  } = useProgress();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <QuickStatCard
          icon={Clock}
          label="Total Study Time"
          value={`${stats?.totalStudyTime || 0} mins`}
          trend={`${stats?.averageSessionLength || 0} mins/session`}
        />
        <QuickStatCard
          icon={Calendar}
          label="Study Sessions"
          value={stats?.totalSessions.toString() || '0'}
          trend={`${stats?.averageSessionsPerWeek || 0} sessions/week`}
        />
        <QuickStatCard
          icon={TrendingUp}
          label="Current Streak"
          value={`${streak?.currentStreak || 0} days`}
          trend={`Longest: ${streak?.longestStreak || 0} days`}
        />
        <QuickStatCard
          icon={Award}
          label="Most Studied"
          value={stats?.mostStudiedSubject || 'N/A'}
          trend="Most productive subject"
        />
      </div>

      {/* Study Progress Chart */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            <h3 className="font-medium text-gray-900 text-sm sm:text-base">Study Progress</h3>
          </div>
          <select className="text-xs sm:text-sm border rounded-md px-2 py-1.5 bg-white">
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div className="h-[200px] sm:h-[300px] lg:h-[400px]">
          <ProgressChart data={stats?.weeklyProgress || []} />
        </div>
      </div>

      {/* Subject Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {subjectProgress.map(subject => (
          <SubjectProgressCard key={subject.subject} progress={subject} />
        ))}
      </div>

      {/* Study Streak */}
      {streak && <StudyStreakCard streak={streak} />}

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Insights */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            <h3 className="font-medium text-gray-900 text-sm sm:text-base">Learning Insights</h3>
          </div>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            <h3 className="font-medium text-gray-900 text-sm sm:text-base">Recommendations</h3>
          </div>
          <RecommendationsList recommendations={recommendations} />
        </div>
      </div>
    </motion.div>
  );
};

const QuickStatCard = ({
  icon: Icon,
  label,
  value,
  trend
}: {
  icon: any;
  label: string;
  value: string;
  trend: string;
}) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-purple-100 rounded-lg">
        <Icon className="w-6 h-6 text-purple-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{trend}</p>
      </div>
    </div>
  </div>
); 