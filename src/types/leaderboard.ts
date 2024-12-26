export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL?: string;
  score: number;
  gamesPlayed: number;
  winRate: number;
  lastPlayed: string;
  rank?: number;
}

export interface SubjectLeaderboard {
  subject: string;
  entries: LeaderboardEntry[];
  lastUpdated: string;
}

export interface WeeklyLeaderboard {
  weekStart: string;
  weekEnd: string;
  entries: LeaderboardEntry[];
  lastUpdated: string;
}

export interface GlobalLeaderboard {
  entries: LeaderboardEntry[];
  lastUpdated: string;
}

export type LeaderboardTimeframe = 'all-time' | 'weekly' | 'monthly';
export type LeaderboardType = 'global' | 'subject' | 'weekly'; 