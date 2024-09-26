import GamePage from './gamePage';

const Games = async () => {
  const res = await fetch('https://www.freetogame.com/api/games', {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch games');
  }

  const games = await res.json();

 
  const genres = [...new Set(games.map((game) => game.genre))];
  const platforms = [...new Set(games.map((game) => game.platform))];

  return (
    <GamePage genres={genres} platforms={platforms} games={games} />
  );
};

export default Games;
