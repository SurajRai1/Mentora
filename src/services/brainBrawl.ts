import { updatePlayerScore, updateSubjectScore } from './leaderboardService';

export const completeBattle = async (battleId: string, winnerId: string) => {
  try {
    const battleRef = doc(db, 'battles', battleId);
    const battleDoc = await getDoc(battleRef);
    
    if (!battleDoc.exists()) {
      throw new Error('Battle not found');
    }

    const battle = battleDoc.data();
    const { player1, player2, subject, player1Score, player2Score } = battle;

    // Update battle status
    await updateDoc(battleRef, {
      status: 'completed',
      winnerId,
      completedAt: serverTimestamp()
    });

    // Update player 1 leaderboard
    const player1Data = await getDoc(doc(db, 'users', player1.id));
    const p1Stats = player1Data.data()?.stats || { gamesPlayed: 0, wins: 0 };
    const p1WinRate = ((p1Stats.wins + (winnerId === player1.id ? 1 : 0)) / (p1Stats.gamesPlayed + 1)) * 100;

    await updatePlayerScore(
      player1.id,
      player1.displayName,
      player1.photoURL,
      player1Score,
      p1Stats.gamesPlayed + 1,
      p1WinRate
    );

    await updateSubjectScore(
      player1.id,
      player1.displayName,
      player1.photoURL,
      subject,
      player1Score,
      p1Stats.gamesPlayed + 1,
      p1WinRate
    );

    // Update player 2 leaderboard
    const player2Data = await getDoc(doc(db, 'users', player2.id));
    const p2Stats = player2Data.data()?.stats || { gamesPlayed: 0, wins: 0 };
    const p2WinRate = ((p2Stats.wins + (winnerId === player2.id ? 1 : 0)) / (p2Stats.gamesPlayed + 1)) * 100;

    await updatePlayerScore(
      player2.id,
      player2.displayName,
      player2.photoURL,
      player2Score,
      p2Stats.gamesPlayed + 1,
      p2WinRate
    );

    await updateSubjectScore(
      player2.id,
      player2.displayName,
      player2.photoURL,
      subject,
      player2Score,
      p2Stats.gamesPlayed + 1,
      p2WinRate
    );

    return true;
  } catch (error) {
    console.error('Error completing battle:', error);
    return false;
  }
}; 