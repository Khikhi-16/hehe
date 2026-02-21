import pb from '@/lib/pocketbaseClient';

export const getGuestStats = async (guestId) => {
  try {
    const scores = await pb.collection('gameScores').getFullList({
      filter: `guestId = "${guestId}"`,
      $autoCancel: false
    });

    let chocolatesCollected = 0;
    let wheelSpins = 0;
    const uniqueGames = new Set();

    scores.forEach(score => {
      if (score.gameType) {
        uniqueGames.add(score.gameType);
      }
      if (score.gameType === 'chocolate') {
        chocolatesCollected += (score.score || 0);
      }
      if (score.gameType === 'wheel') {
        wheelSpins += 1;
      }
    });

    return {
      chocolatesCollected,
      wheelSpins,
      gamesPlayed: uniqueGames.size
    };
  } catch (error) {
    console.error("Error fetching guest stats:", error);
    return {
      chocolatesCollected: 0,
      wheelSpins: 0,
      gamesPlayed: 0
    };
  }
};
