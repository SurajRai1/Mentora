export interface StudySession {
  id: string;
  userId: string;
  subject: string;
  topics: string[];
  startTime: string;
  endTime: string;
  duration: number;
  rating?: number;
  notes?: string;
  createdAt: string;
}

export interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  streakHistory: {
    date: string;
    sessionsCompleted: number;
  }[];
}

export interface SubjectProgress {
  subject: string;
  totalTime: number;
  sessionsCompleted: number;
  averageRating: number;
  lastStudied: string;
  topicsStudied: {
    topic: string;
    timeSpent: number;
  }[];
  weeklyProgress: {
    week: string;
    timeSpent: number;
    sessionsCompleted: number;
  }[];
}

export interface StudyInsight {
  type: 'achievement' | 'warning' | 'milestone' | 'suggestion';
  title: string;
  description: string;
  date: string;
  actionable: boolean;
  action?: {
    label: string;
    url: string;
  };
}

export interface ProgressStats {
  totalStudyTime: number;
  totalSessions: number;
  averageSessionLength: number;
  averageSessionsPerWeek: number;
  mostProductiveDay: string;
  mostStudiedSubject: string;
  currentStreak: number;
  weeklyProgress: {
    week: string;
    totalTime: number;
    sessionsCompleted: number;
    averageRating: number;
  }[];
}

export interface StudyRecommendation {
  id: string;
  type: 'topic' | 'method' | 'schedule';
  title: string;
  description: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  subject?: string;
  timeEstimate: number;
  completed: boolean;
}

export interface LearningGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  targetDate: string;
  targetValue: number;
  currentValue: number;
  status: 'active' | 'completed' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

export interface ProgressReport {
  id: string;
  userId: string;
  period: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  stats: ProgressStats;
  subjectProgress: SubjectProgress[];
  insights: StudyInsight[];
  recommendations: StudyRecommendation[];
  goals: {
    completed: number;
    total: number;
    details: {
      goalId: string;
      title: string;
      progress: number;
      status: string;
    }[];
  };
  generatedAt: string;
} 