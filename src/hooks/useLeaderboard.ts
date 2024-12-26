import { useState, useEffect } from 'react';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { rtdb } from '../lib/firebase';
import { 
  LeaderboardEntry, 
  GlobalLeaderboard, 
  SubjectLeaderboard, 
  WeeklyLeaderboard,
  LeaderboardType,
  LeaderboardTimeframe
} from '../types/leaderboard';

interface UseLeaderboardReturn {
  globalLeaderboard: GlobalLeaderboard | null;
  subjectLeaderboard: SubjectLeaderboard | null;
  weeklyLeaderboard: WeeklyLeaderboard | null;
  loading: boolean;
  error: string | null;
}

export const useLeaderboard = (
  type: LeaderboardType = 'global',
  subject?: string,
  timeframe: LeaderboardTimeframe = 'all-time'
): UseLeaderboardReturn => {
  const [globalLeaderboard, setGlobalLeaderboard] = useState<GlobalLeaderboard | null>(null);
  const [subjectLeaderboard, setSubjectLeaderboard] = useState<SubjectLeaderboard | null>(null);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<WeeklyLeaderboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchLeaderboard = () => {
      try {
        setLoading(true);
        setError(null);

        let leaderboardRef;
        
        switch (type) {
          case 'global':
            leaderboardRef = ref(rtdb, 'leaderboards/global');
            break;
          case 'subject':
            if (!subject) throw new Error('Subject is required for subject leaderboard');
            leaderboardRef = ref(rtdb, `leaderboards/subjects/${subject}`);
            break;
          case 'weekly':
            // Get current week's start and end dates
            const now = new Date();
            const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
            weekStart.setHours(0, 0, 0, 0);
            leaderboardRef = ref(rtdb, `leaderboards/weekly/${weekStart.toISOString().split('T')[0]}`);
            break;
        }

        // Create query to get top 100 players ordered by score
        const leaderboardQuery = query(
          leaderboardRef,
          orderByChild('score'),
          limitToLast(100)
        );

        unsubscribe = onValue(leaderboardQuery, (snapshot) => {
          if (!snapshot.exists()) {
            // Initialize empty leaderboard if it doesn't exist
            const emptyLeaderboard = {
              entries: [],
              lastUpdated: new Date().toISOString()
            };

            switch (type) {
              case 'global':
                setGlobalLeaderboard(emptyLeaderboard as GlobalLeaderboard);
                break;
              case 'subject':
                setSubjectLeaderboard({
                  ...emptyLeaderboard,
                  subject: subject!
                } as SubjectLeaderboard);
                break;
              case 'weekly':
                const now = new Date();
                const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                setWeeklyLeaderboard({
                  ...emptyLeaderboard,
                  weekStart: weekStart.toISOString(),
                  weekEnd: weekEnd.toISOString()
                } as WeeklyLeaderboard);
                break;
            }
          } else {
            const data = snapshot.val();
            const entries = Object.entries(data)
              .map(([key, value]: [string, any]) => ({
                ...value,
                rank: 0 // Will be calculated below
              }))
              .sort((a, b) => b.score - a.score)
              .map((entry, index) => ({
                ...entry,
                rank: index + 1
              }));

            const lastUpdated = new Date().toISOString();

            switch (type) {
              case 'global':
                setGlobalLeaderboard({
                  entries,
                  lastUpdated
                });
                break;
              case 'subject':
                setSubjectLeaderboard({
                  subject: subject!,
                  entries,
                  lastUpdated
                });
                break;
              case 'weekly':
                const now = new Date();
                const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                setWeeklyLeaderboard({
                  weekStart: weekStart.toISOString(),
                  weekEnd: weekEnd.toISOString(),
                  entries,
                  lastUpdated
                });
                break;
            }
          }
          setLoading(false);
        }, (error) => {
          console.error('Error fetching leaderboard:', error);
          setError('Failed to load leaderboard');
          setLoading(false);
        });

      } catch (err) {
        console.error('Error setting up leaderboard listener:', err);
        setError('Failed to load leaderboard');
        setLoading(false);
      }
    };

    fetchLeaderboard();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [type, subject, timeframe]);

  return {
    globalLeaderboard,
    subjectLeaderboard,
    weeklyLeaderboard,
    loading,
    error
  };
}; 