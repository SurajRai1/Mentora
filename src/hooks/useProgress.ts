import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  limit,
  startAfter
} from 'firebase/firestore';
import {
  StudySession,
  StudyStreak,
  SubjectProgress,
  StudyInsight,
  ProgressStats,
  StudyRecommendation
} from '../types/progress';

interface UseProgressReturn {
  stats: ProgressStats | null;
  streak: StudyStreak | null;
  subjectProgress: SubjectProgress[];
  insights: StudyInsight[];
  recommendations: StudyRecommendation[];
  recentSessions: StudySession[];
  loading: boolean;
  error: string | null;
  startStudySession: (subject: string, topics: string[]) => Promise<string>;
  endStudySession: (sessionId: string, rating?: number, notes?: string) => Promise<void>;
  fetchMoreSessions: () => Promise<void>;
}

export const useProgress = (): UseProgressReturn => {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [streak, setStreak] = useState<StudyStreak | null>(null);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);
  const [insights, setInsights] = useState<StudyInsight[]>([]);
  const [recommendations, setRecommendations] = useState<StudyRecommendation[]>([]);
  const [recentSessions, setRecentSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSession, setLastSession] = useState<any>(null);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Please sign in to view your progress');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Fetch recent study sessions
        const sessionsQuery = query(
          collection(db, 'studySessions'),
          where('userId', '==', user.uid),
        orderBy('startTime', 'desc'),
        limit(10)
        );

        const sessionsSnapshot = await getDocs(sessionsQuery);
      const sessions = sessionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as StudySession[];

      // Even if there are no sessions, we'll initialize with empty data
      setRecentSessions(sessions);
      if (sessions.length > 0) {
        setLastSession(sessionsSnapshot.docs[sessionsSnapshot.docs.length - 1]);
      }

      // Calculate streak
      const streak = calculateStreak(sessions);
      setStreak(streak);

      // Calculate subject progress
      const progress = calculateSubjectProgress(sessions);
      setSubjectProgress(progress);

      // Calculate overall stats
      const stats = calculateStats(sessions);
      setStats(stats);

      // Generate insights
      const insights = generateInsights(stats, streak, progress);
      setInsights(insights);

      // Generate recommendations
      const recommendations = generateRecommendations(stats, progress);
      setRecommendations(recommendations);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching progress data:', error);
      // Initialize with empty data instead of showing error
        setStats({
        totalStudyTime: 0,
        totalSessions: 0,
        averageSessionLength: 0,
        averageSessionsPerWeek: 0,
        mostProductiveDay: '',
        mostStudiedSubject: '',
        currentStreak: 0,
        weeklyProgress: []
      });
      setStreak({
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: '',
        streakHistory: []
      });
      setSubjectProgress([]);
      setInsights([{
        type: 'suggestion',
        title: 'Start Your Learning Journey',
        description: 'Begin by selecting a subject and starting your first study session!',
        date: new Date().toISOString(),
        actionable: true,
        action: {
          label: 'Start Learning',
          url: '/subjects'
        }
      }]);
      setRecommendations([{
        id: 'get-started',
        type: 'method',
        title: 'Create Your First Study Session',
        description: 'Start tracking your progress by completing your first study session.',
        reason: 'New user onboarding',
        priority: 'high',
        timeEstimate: 15,
        completed: false
      }]);
      setLoading(false);
    }
  };

  const startStudySession = async (subject: string, topics: string[]): Promise<string> => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const session: Omit<StudySession, 'id'> = {
        userId: user.uid,
        subject,
        topics,
        startTime: new Date().toISOString(),
        duration: 0,
        endTime: '',
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'studySessions'), session);
      return docRef.id;
    } catch (error) {
      console.error('Error starting study session:', error);
      throw new Error('Failed to start study session');
    }
  };

  const endStudySession = async (sessionId: string, rating?: number, notes?: string): Promise<void> => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const endTime = new Date().toISOString();
      const sessionRef = doc(db, 'studySessions', sessionId);
      
      await updateDoc(sessionRef, {
        endTime,
        rating,
        notes,
        duration: calculateDuration(sessionId, endTime)
      });

      // Refresh progress data
      await fetchProgressData();
      } catch (error) {
      console.error('Error ending study session:', error);
      throw new Error('Failed to end study session');
    }
  };

  const fetchMoreSessions = async () => {
    if (!lastSession || loading) return;

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const sessionsQuery = query(
        collection(db, 'studySessions'),
        where('userId', '==', user.uid),
        orderBy('startTime', 'desc'),
        startAfter(lastSession),
        limit(10)
      );

      const sessionsSnapshot = await getDocs(sessionsQuery);
      const newSessions = sessionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StudySession[];

      setRecentSessions(prev => [...prev, ...newSessions]);
      if (newSessions.length > 0) {
        setLastSession(sessionsSnapshot.docs[sessionsSnapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error('Error fetching more sessions:', error);
      setError('Failed to load more sessions');
    }
  };

  return {
    stats,
    streak,
    subjectProgress,
    insights,
    recommendations,
    recentSessions,
    loading,
    error,
    startStudySession,
    endStudySession,
    fetchMoreSessions
  };
};

// Helper functions
const calculateDuration = (startTime: string, endTime: string): number => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // Duration in minutes
};

const calculateStreak = (sessions: StudySession[]): StudyStreak => {
  if (!sessions.length) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: '',
      streakHistory: []
    };
  }

  // Sort sessions by date
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastStudyDate = new Date(sortedSessions[0].startTime);
  lastStudyDate.setHours(0, 0, 0, 0);

  // Initialize streak data
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const streakHistory: { date: string; sessionsCompleted: number }[] = [];
  const sessionsByDate = new Map<string, number>();

  // Group sessions by date
  sortedSessions.forEach(session => {
    const date = new Date(session.startTime);
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().split('T')[0];
    sessionsByDate.set(dateStr, (sessionsByDate.get(dateStr) || 0) + 1);
  });

  // Calculate streaks
  let currentDate = new Date(today);
  for (let i = 0; i < 30; i++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const sessionsCount = sessionsByDate.get(dateStr) || 0;
    
    streakHistory.unshift({
      date: dateStr,
      sessionsCompleted: sessionsCount
    });

    if (sessionsCount > 0) {
      tempStreak++;
      if (i === 0) currentStreak = tempStreak;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 0;
    }

    currentDate.setDate(currentDate.getDate() - 1);
  }

  // Update longest streak one final time
  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    currentStreak,
    longestStreak,
    lastStudyDate: lastStudyDate.toISOString(),
    streakHistory
  };
};

const calculateSubjectProgress = (sessions: StudySession[]): SubjectProgress[] => {
  if (!sessions.length) return [];

  const subjectMap = new Map<string, {
    totalTime: number;
    sessionsCompleted: number;
    ratings: number[];
    lastStudied: string;
    topics: Map<string, number>;
    weeklyData: Map<string, { timeSpent: number; sessionsCompleted: number }>;
  }>();

  sessions.forEach(session => {
    const subject = session.subject;
    const subjectData = subjectMap.get(subject) || {
      totalTime: 0,
      sessionsCompleted: 0,
      ratings: [],
      lastStudied: session.startTime,
      topics: new Map<string, number>(),
      weeklyData: new Map<string, { timeSpent: number; sessionsCompleted: number }>()
    };

    // Update basic stats
    subjectData.totalTime += session.duration;
    subjectData.sessionsCompleted++;
    if (session.rating) subjectData.ratings.push(session.rating);
    if (new Date(session.startTime) > new Date(subjectData.lastStudied)) {
      subjectData.lastStudied = session.startTime;
    }

    // Update topics
    session.topics.forEach(topic => {
      subjectData.topics.set(
        topic,
        (subjectData.topics.get(topic) || 0) + session.duration
      );
    });

    // Update weekly data
    const weekStart = new Date(session.startTime);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    
    const weekData = subjectData.weeklyData.get(weekKey) || { timeSpent: 0, sessionsCompleted: 0 };
    weekData.timeSpent += session.duration;
    weekData.sessionsCompleted++;
    subjectData.weeklyData.set(weekKey, weekData);

    subjectMap.set(subject, subjectData);
  });

  return Array.from(subjectMap.entries()).map(([subject, data]) => ({
    subject,
    totalTime: data.totalTime,
    sessionsCompleted: data.sessionsCompleted,
    averageRating: data.ratings.length
      ? data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length
      : 0,
    lastStudied: data.lastStudied,
    topicsStudied: Array.from(data.topics.entries())
      .map(([topic, timeSpent]) => ({ topic, timeSpent }))
      .sort((a, b) => b.timeSpent - a.timeSpent),
    weeklyProgress: Array.from(data.weeklyData.entries())
      .map(([week, progress]) => ({
        week,
        timeSpent: progress.timeSpent,
        sessionsCompleted: progress.sessionsCompleted
      }))
      .sort((a, b) => a.week.localeCompare(b.week))
  }));
};

const calculateStats = (sessions: StudySession[]): ProgressStats => {
  if (!sessions.length) {
    return {
      totalStudyTime: 0,
      totalSessions: 0,
      averageSessionLength: 0,
      averageSessionsPerWeek: 0,
      mostProductiveDay: '',
      mostStudiedSubject: '',
      currentStreak: 0,
      weeklyProgress: []
    };
  }

  // Calculate basic stats
  const totalStudyTime = sessions.reduce((sum, session) => sum + session.duration, 0);
  const totalSessions = sessions.length;
  const averageSessionLength = totalStudyTime / totalSessions;

  // Calculate subject totals
  const subjectTimes = new Map<string, number>();
  sessions.forEach(session => {
    subjectTimes.set(
      session.subject,
      (subjectTimes.get(session.subject) || 0) + session.duration
    );
  });

  // Find most studied subject
  const mostStudiedSubject = Array.from(subjectTimes.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

  // Calculate weekly progress
  const weeklyData = new Map<string, {
    totalTime: number;
    sessionsCompleted: number;
    ratings: number[];
  }>();

  sessions.forEach(session => {
    const weekStart = new Date(session.startTime);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    
    const weekStats = weeklyData.get(weekKey) || {
      totalTime: 0,
      sessionsCompleted: 0,
      ratings: []
    };

    weekStats.totalTime += session.duration;
    weekStats.sessionsCompleted++;
    if (session.rating) weekStats.ratings.push(session.rating);
    
    weeklyData.set(weekKey, weekStats);
  });

  const weeklyProgress = Array.from(weeklyData.entries())
    .map(([week, stats]) => ({
      week,
      totalTime: stats.totalTime,
      sessionsCompleted: stats.sessionsCompleted,
      averageRating: stats.ratings.length
        ? stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length
        : 0
    }))
    .sort((a, b) => a.week.localeCompare(b.week));

  // Calculate average sessions per week
  const averageSessionsPerWeek = weeklyProgress.length
    ? totalSessions / weeklyProgress.length
    : 0;

  // Find most productive day
  const dayStats = new Map<string, number>();
  sessions.forEach(session => {
    const day = new Date(session.startTime).toLocaleDateString('en-US', { weekday: 'long' });
    dayStats.set(day, (dayStats.get(day) || 0) + session.duration);
  });

  const mostProductiveDay = Array.from(dayStats.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

  return {
    totalStudyTime,
    totalSessions,
    averageSessionLength,
    averageSessionsPerWeek,
    mostProductiveDay,
    mostStudiedSubject,
    currentStreak: 0, // This will be updated by the streak calculation
    weeklyProgress
  };
};

const generateInsights = (
  stats: ProgressStats | null,
  streak: StudyStreak | null,
  progress: SubjectProgress[]
): StudyInsight[] => {
  const insights: StudyInsight[] = [];

  if (!stats || !streak) return insights;

  // Streak-based insights
  if (streak.currentStreak > 0) {
    insights.push({
      type: 'achievement',
      title: `${streak.currentStreak} Day Streak! 🔥`,
      description: `You've been studying consistently for ${streak.currentStreak} days. Keep it up!`,
      date: new Date().toISOString(),
      actionable: false
    });
  }

  if (streak.currentStreak === 0) {
    insights.push({
      type: 'warning',
      title: 'Break the Study Break',
      description: 'It\'s been a while since your last study session. Ready to get back on track?',
      date: new Date().toISOString(),
      actionable: true,
      action: {
        label: 'Start Studying',
        url: '/subjects'
      }
    });
  }

  // Progress-based insights
  progress.forEach(subject => {
    if (subject.averageRating >= 4) {
      insights.push({
        type: 'achievement',
        title: `${subject.subject} Master`,
        description: `You're doing great in ${subject.subject} with an average rating of ${subject.averageRating.toFixed(1)}/5!`,
        date: new Date().toISOString(),
        actionable: false
      });
    }

    if (subject.averageRating < 3) {
      insights.push({
        type: 'suggestion',
        title: `${subject.subject} Needs Attention`,
        description: `Your ratings in ${subject.subject} suggest you might need some extra practice.`,
        date: new Date().toISOString(),
        actionable: true,
        action: {
          label: 'Practice Now',
          url: `/subjects/${subject.subject}`
        }
      });
    }
  });

  // Milestone insights
  if (stats.totalSessions > 0) {
    const milestones = [10, 25, 50, 100, 250, 500];
    const nextMilestone = milestones.find(m => stats.totalSessions < m);
    
    if (nextMilestone) {
      const remaining = nextMilestone - stats.totalSessions;
      insights.push({
        type: 'milestone',
        title: `Almost at ${nextMilestone} Sessions!`,
        description: `Just ${remaining} more study sessions to reach this milestone.`,
        date: new Date().toISOString(),
        actionable: false
      });
    }
  }

  return insights.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const generateRecommendations = (
  stats: ProgressStats | null,
  progress: SubjectProgress[]
): StudyRecommendation[] => {
  const recommendations: StudyRecommendation[] = [];

  if (!stats || !progress.length) return recommendations;

  // Find subjects needing attention
  progress.forEach(subject => {
    if (subject.averageRating < 3.5) {
      recommendations.push({
        id: `improve-${subject.subject.toLowerCase()}`,
        type: 'topic',
        title: `Focus on ${subject.subject}`,
        description: `Your performance in ${subject.subject} could use some improvement.`,
        reason: 'Low average rating',
        priority: 'high',
        subject: subject.subject,
        timeEstimate: 30,
        completed: false
      });
    }
  });

  // Recommend based on study patterns
  if (stats.averageSessionLength < 30) {
    recommendations.push({
      id: 'longer-sessions',
      type: 'method',
      title: 'Try Longer Study Sessions',
      description: 'Increasing your study session length can help with deeper understanding.',
      reason: 'Short average session length',
      priority: 'medium',
      timeEstimate: 45,
      completed: false
    });
  }

  // Schedule recommendations
  if (stats.averageSessionsPerWeek < 3) {
    recommendations.push({
      id: 'consistent-schedule',
      type: 'schedule',
      title: 'Create a Study Schedule',
      description: 'Aim for at least 3-4 study sessions per week for better progress.',
      reason: 'Low weekly session frequency',
      priority: 'high',
      timeEstimate: 15,
      completed: false
    });
  }

  return recommendations;
};