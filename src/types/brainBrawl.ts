export type Subject = 
  | 'Mathematics'
  | 'Science'
  | 'Computer Science'
  | 'History'
  | 'Music'
  | 'General Knowledge'
  | 'Economics'
  | 'Mix of All Subjects';

export type GradeLevel = 'High School' | 'Senior High School' | 'Undergraduate' | 'Graduate';

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  subject: Subject;
  gradeLevel: GradeLevel;
};

export type BattleState = 'waiting' | 'matched' | 'in-progress' | 'completed';

export type PlayerType = 'human' | 'bot';

export type PlayerAnswer = {
  questionId: string;
  selectedOption: number;
  timeSpent: number;
};

export type BattleResult = {
  winnerId: string;
  player1Score: number;
  player2Score: number;
  timeRemaining: number;
};

export type Battle = {
  id: string;
  player1Id: string;
  player2Id: string;
  player2Type: PlayerType;
  questions: Question[];
  player1Answers: PlayerAnswer[];
  player2Answers: PlayerAnswer[];
  startTime: number;
  endTime?: number;
  state: BattleState;
  subject: Subject;
  gradeLevel: GradeLevel;
  result?: BattleResult;
  lastUpdateTime: number;
  searchStartTime: number;
}; 