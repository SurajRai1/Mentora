import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { QuizResult } from '../types';

interface QuizStats {
  totalQuizzes: number;
  averageScore: number;
  subjectPerformance: Record<string, {
    totalQuizzes: number;
    averageScore: number;
    highestScore: number;
    recentScores: number[];
  }>;
  recentResults: QuizResult[];
  strongestSubject: string;
  weakestSubject: string;
}

export const useQuizResults = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<QuizStats | null>(null);

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        const quizResultsRef = collection(db, 'users', user.uid, 'quizResults');
        const q = query(quizResultsRef, orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);

        const results: QuizResult[] = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() } as QuizResult);
        });

        // Calculate statistics
        const subjectPerformance: Record<string, {
          totalQuizzes: number;
          averageScore: number;
          highestScore: number;
          recentScores: number[];
        }> = {};

        // Process each result
        results.forEach((result) => {
          if (!subjectPerformance[result.subject]) {
            subjectPerformance[result.subject] = {
              totalQuizzes: 0,
              averageScore: 0,
              highestScore: 0,
              recentScores: [],
            };
          }

          const subject = subjectPerformance[result.subject];
          subject.totalQuizzes++;
          subject.recentScores.push(result.score);
          subject.highestScore = Math.max(subject.highestScore, result.score);
          subject.averageScore = subject.recentScores.reduce((a, b) => a + b, 0) / subject.recentScores.length;
        });

        // Find strongest and weakest subjects
        let strongestSubject = '';
        let weakestSubject = '';
        let highestAvg = -1;
        let lowestAvg = 101;

        Object.entries(subjectPerformance).forEach(([subject, data]) => {
          if (data.averageScore > highestAvg) {
            highestAvg = data.averageScore;
            strongestSubject = subject;
          }
          if (data.averageScore < lowestAvg) {
            lowestAvg = data.averageScore;
            weakestSubject = subject;
          }
        });

        // Calculate overall stats
        const totalQuizzes = results.length;
        const averageScore = results.reduce((sum, result) => sum + result.score, 0) / totalQuizzes;

        setStats({
          totalQuizzes,
          averageScore,
          subjectPerformance,
          recentResults: results.slice(0, 5), // Last 5 quizzes
          strongestSubject,
          weakestSubject,
        });

      } catch (err) {
        console.error('Error fetching quiz results:', err);
        setError('Failed to load quiz results');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResults();
  }, []);

  return { stats, loading, error };
}; 