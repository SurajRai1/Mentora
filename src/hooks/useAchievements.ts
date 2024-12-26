import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  updateDoc,
  doc,
  writeBatch
} from 'firebase/firestore';
import { Achievement, QuizResult, StudySession } from '../types';

const DEFAULT_ACHIEVEMENTS: Omit<Achievement, 'id' | 'unlockedAt' | 'progress'>[] = [
  {
    title: 'First Steps',
    description: 'Complete your first quiz',
    icon: '🎯',
    category: 'quiz',
    requirement: {
      type: 'quiz_count',
      value: 1
    }
  },
  {
    title: 'Perfect Score',
    description: 'Get 100% on any quiz',
    icon: '🌟',
    category: 'quiz',
    requirement: {
      type: 'quiz_score',
      value: 100
    }
  },
  {
    title: 'Study Streak',
    description: 'Study for 7 days in a row',
    icon: '🔥',
    category: 'streak',
    requirement: {
      type: 'streak',
      value: 7
    }
  },
  {
    title: 'Math Master',
    description: 'Complete 10 math quizzes with an average score of 90%',
    icon: '🧮',
    category: 'milestone',
    requirement: {
      type: 'subject_mastery',
      value: 90,
      subject: 'Mathematics'
    }
  }
];

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const achievementsRef = collection(db, 'users', user.uid, 'achievements');
      const snapshot = await getDocs(achievementsRef);

      if (snapshot.empty) {
        // Initialize default achievements for new users
        await initializeAchievements();
        return;
      }

      const fetchedAchievements: Achievement[] = [];
      snapshot.forEach((doc) => {
        fetchedAchievements.push({ id: doc.id, ...doc.data() } as Achievement);
      });

      setAchievements(fetchedAchievements);
    } catch (err) {
      console.error('Error fetching achievements:', err);
      setError('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const initializeAchievements = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const batch = writeBatch(db);
      const achievementsRef = collection(db, 'users', user.uid, 'achievements');

      const initializedAchievements: Achievement[] = [];

      for (const achievement of DEFAULT_ACHIEVEMENTS) {
        const newAchievement: Omit<Achievement, 'id'> = {
          ...achievement,
          progress: 0
        };

        const docRef = doc(achievementsRef);
        batch.set(docRef, newAchievement);
        initializedAchievements.push({ ...newAchievement, id: docRef.id });
      }

      await batch.commit();
      setAchievements(initializedAchievements);
    } catch (err) {
      console.error('Error initializing achievements:', err);
      throw new Error('Failed to initialize achievements');
    }
  };

  const checkQuizAchievements = async (quizResult: QuizResult) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const quizResultsRef = collection(db, 'users', user.uid, 'quizResults');
      const quizResultsSnapshot = await getDocs(quizResultsRef);
      const quizResults = quizResultsSnapshot.docs.map(doc => doc.data() as QuizResult);

      const updates: Promise<void>[] = [];

      for (const achievement of achievements) {
        if (achievement.unlockedAt) continue;

        switch (achievement.requirement.type) {
          case 'quiz_count': {
            const progress = quizResults.length;
            if (progress >= achievement.requirement.value) {
              updates.push(unlockAchievement(achievement.id));
            } else {
              updates.push(updateAchievementProgress(achievement.id, progress));
            }
            break;
          }
          case 'quiz_score': {
            if (quizResult.score >= achievement.requirement.value) {
              updates.push(unlockAchievement(achievement.id));
            }
            break;
          }
          case 'subject_mastery': {
            if (achievement.requirement.subject === quizResult.subject) {
              const subjectQuizzes = quizResults.filter(r => r.subject === quizResult.subject);
              const averageScore = subjectQuizzes.reduce((sum, r) => sum + r.score, 0) / subjectQuizzes.length;
              const progress = Math.min(100, (averageScore / achievement.requirement.value) * 100);
              
              if (averageScore >= achievement.requirement.value && subjectQuizzes.length >= 10) {
                updates.push(unlockAchievement(achievement.id));
              } else {
                updates.push(updateAchievementProgress(achievement.id, progress));
              }
            }
            break;
          }
        }
      }

      await Promise.all(updates);
      await fetchAchievements();
    } catch (err) {
      console.error('Error checking quiz achievements:', err);
    }
  };

  const unlockAchievement = async (achievementId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const achievementRef = doc(db, 'users', user.uid, 'achievements', achievementId);
      await updateDoc(achievementRef, {
        unlockedAt: new Date().toISOString(),
        progress: 100
      });

      setAchievements(prev => prev.map(achievement => 
        achievement.id === achievementId
          ? { ...achievement, unlockedAt: new Date().toISOString(), progress: 100 }
          : achievement
      ));
    } catch (err) {
      console.error('Error unlocking achievement:', err);
      throw new Error('Failed to unlock achievement');
    }
  };

  const updateAchievementProgress = async (achievementId: string, progress: number) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const achievementRef = doc(db, 'users', user.uid, 'achievements', achievementId);
      await updateDoc(achievementRef, { progress });

      setAchievements(prev => prev.map(achievement => 
        achievement.id === achievementId
          ? { ...achievement, progress }
          : achievement
      ));
    } catch (err) {
      console.error('Error updating achievement progress:', err);
      throw new Error('Failed to update achievement progress');
    }
  };

  return {
    achievements,
    loading,
    error,
    checkQuizAchievements,
    refreshAchievements: fetchAchievements
  };
}; 