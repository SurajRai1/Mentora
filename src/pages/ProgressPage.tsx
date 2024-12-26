import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  Target, 
  Clock, 
  Trophy,
  BookOpen,
  Brain,
  Calendar,
  TrendingUp,
  Award,
  FileText
} from 'lucide-react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useQuizResults } from '../hooks/useQuizResults';
import { useProgress } from '../hooks/useProgress';
import { QuizPerformance } from '../components/progress/QuizPerformance';
import { LearningGoals } from '../components/progress/LearningGoals';
import { Achievements } from '../components/progress/Achievements';
import { LearningAnalyticsDashboard } from '../components/progress/LearningAnalyticsDashboard';
import { ProgressReports } from '../components/progress/ProgressReports';
import { ProgressReport } from '../types/progress';

type TabType = 'overview' | 'performance' | 'goals' | 'reports';

interface QuickStatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
}

const QuickStatCard: React.FC<QuickStatCardProps> = ({ icon: Icon, label, value, trend }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className="p-3 bg-purple-50 rounded-lg">
        <Icon className="w-6 h-6 text-purple-600" />
      </div>
    </div>
    <p className="mt-2 text-sm text-gray-600">{trend}</p>
  </div>
);

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'performance', label: 'Performance', icon: TrendingUp },
  { id: 'goals', label: 'Goals & Achievements', icon: Target },
  { id: 'reports', label: 'Reports', icon: FileText }
];

export const ProgressPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { profile, loading: profileLoading } = useUserProfile();
  const { stats: quizStats, loading: quizLoading, error: quizError } = useQuizResults();
  const { stats, streak, subjectProgress, insights, recommendations, loading: progressLoading } = useProgress();

  const loading = profileLoading || quizLoading || progressLoading;

  const generateReport = (): ProgressReport => {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - 30); // Last 30 days

    return {
      id: `report-${Date.now()}`,
      userId: profile?.id || '',
      period: 'monthly',
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
      stats: stats || {
        totalStudyTime: 0,
        totalSessions: 0,
        averageSessionLength: 0,
        averageSessionsPerWeek: 0,
        mostProductiveDay: '',
        mostStudiedSubject: '',
        currentStreak: 0,
        weeklyProgress: []
      },
      subjectProgress: subjectProgress || [],
      insights: insights || [],
      recommendations: recommendations || [],
      goals: {
        completed: 0,
        total: 0,
        details: []
      },
      generatedAt: now.toISOString()
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Learning Progress</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Track your achievements, monitor progress, and set new learning goals.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <QuickStatCard
          icon={Clock}
          label="Study Time"
          value={stats ? `${stats.totalStudyTime} mins` : '0 mins'}
          trend="Total study time"
        />
        <QuickStatCard
          icon={Brain}
          label="Sessions"
          value={stats?.totalSessions.toString() || '0'}
          trend={`${stats?.averageSessionLength || 0} mins avg`}
        />
        <QuickStatCard
          icon={Trophy}
          label="Streak"
          value={streak?.currentStreak.toString() || '0'}
          trend={`Longest: ${streak?.longestStreak || 0} days`}
        />
        <QuickStatCard
          icon={Calendar}
          label="Subjects"
          value={subjectProgress?.length.toString() || '0'}
          trend="Active subjects"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 sm:mb-8 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <nav className="flex space-x-4 sm:space-x-8 min-w-[400px] sm:min-w-0" aria-label="Progress sections">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as TabType)}
              className={`
                pb-3 sm:pb-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap
                ${activeTab === id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {label}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-1 gap-6 sm:gap-8"
      >
        {activeTab === 'overview' && (
          <LearningAnalyticsDashboard />
        )}
        {activeTab === 'performance' && quizStats && (
          <QuizPerformance stats={quizStats} />
        )}
        {activeTab === 'goals' && (
          <div className="space-y-6 sm:space-y-8">
            <LearningGoals />
            <Achievements />
          </div>
        )}
        {activeTab === 'reports' && (
          <ProgressReports report={generateReport()} />
        )}
      </motion.div>
    </div>
  );
};