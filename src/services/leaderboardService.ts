import { ref, set, get } from 'firebase/database';
import { rtdb } from '../lib/firebase';
import { LeaderboardEntry } from '../types/leaderboard';

export const updatePlayerScore = async (
  userId: string,
  displayName: string,
  photoURL: string | undefined,
  score: number,
  gamesPlayed: number,
  winRate: number
) => {
  try {
    const entry: LeaderboardEntry = {
      userId,
      displayName,
      photoURL,
      score,
      gamesPlayed,
      winRate,
      lastPlayed: new Date().toISOString()
    };

    // Update global leaderboard
    await set(ref(rtdb, `leaderboards/global/${userId}`), entry);

    // Get current week's start date for weekly leaderboard
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    weekStart.setHours(0, 0, 0, 0);
    const weekKey = weekStart.toISOString().split('T')[0];

    // Update weekly leaderboard
    await set(ref(rtdb, `leaderboards/weekly/${weekKey}/${userId}`), entry);

    return true;
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    return false;
  }
};

export const updateSubjectScore = async (
  userId: string,
  displayName: string,
  photoURL: string | undefined,
  subject: string,
  score: number,
  gamesPlayed: number,
  winRate: number
) => {
  try {
    const entry: LeaderboardEntry = {
      userId,
      displayName,
      photoURL,
      score,
      gamesPlayed,
      winRate,
      lastPlayed: new Date().toISOString()
    };

    // Update subject-specific leaderboard
    await set(ref(rtdb, `leaderboards/subjects/${subject}/${userId}`), entry);

    return true;
  } catch (error) {
    console.error('Error updating subject leaderboard:', error);
    return false;
  }
}; 