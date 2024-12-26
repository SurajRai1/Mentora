export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  gradeLevel: string;
  subjects: string[];
  learningGoals: string[];
  createdAt: string;
  lastActive: string;
}

export interface StudySession {
  id: string;
  userId: string;
  topic: string;
  duration: number;
  completedAt: string;
  score?: number;
  notes?: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'quiz' | 'study' | 'streak' | 'milestone';
  requirement: {
    type: 'quiz_score' | 'quiz_count' | 'study_time' | 'streak' | 'subject_mastery';
    value: number;
    subject?: string;
  };
  unlockedAt?: string;
  progress: number;
}

export interface LearningGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'quiz' | 'study' | 'subject' | 'custom';
  targetDate: string;
  targetValue: number;
  currentValue: number;
  subject?: string;
  status: 'active' | 'completed' | 'overdue';
  createdAt: string;
  completedAt?: string;
}

export interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  streakHistory: {
    date: string;
    activities: Array<{
      type: 'quiz' | 'study';
      duration?: number;
      subject?: string;
    }>;
  }[];
}

export interface StudyResource {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'flashcard';
  subject: string;
  difficulty: string;
  url: string;
  description: string;
}

export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark';
  emailNotifications: boolean;
  studyReminders: boolean;
  aiTone: 'friendly' | 'professional' | 'casual';
}

export interface QuizResult {
  id: string;
  quizId: string;
  subject: string;
  title: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timestamp: string;
  answers: Record<string, string>;
}

export interface StudyStats {
  totalStudyTime: number;
  weeklyStudyTime: number;
  monthlyStudyTime: number;
  subjectDistribution: Record<string, number>;
  lastStudySession?: StudySession;
  streak: StudyStreak;
}

export interface ProgressReport {
  id: string;
  userId: string;
  period: 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  stats: {
    studyTime: number;
    quizzesTaken: number;
    averageScore: number;
    subjectProgress: Record<string, {
      studyTime: number;
      quizzesTaken: number;
      averageScore: number;
      improvement: number;
    }>;
    goalsCompleted: number;
    achievementsUnlocked: number;
  };
  insights: string[];
  recommendations: string[];
  generatedAt: string;
}