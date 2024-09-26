"use client"; // Keep this line
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

const TopScores = () => {
  const [topScores, setTopScores] = useState([]);

  useEffect(() => {
    const savedReviews = localStorage.getItem('gameReviews');
    
    if (savedReviews) {
      const reviews = JSON.parse(savedReviews);
      const scoreMap = {};

      for (const gameId in reviews) {
        const gameData = reviews[gameId];
        const gameReviews = gameData || [];
        const totalScore = gameReviews.reduce((sum, review) => sum + review.score, 0);
        const averageScore = gameReviews.length > 0 ? totalScore / gameReviews.length : 0;

        scoreMap[gameId] = {
          averageScore,
          title: gameReviews[0].title,
          thumbnail: gameReviews[0].thumbnail,
        };
      }

      const sortedScores = Object.entries(scoreMap)
        .sort(([, { averageScore: scoreA }], [, { averageScore: scoreB }]) => scoreB - scoreA)
        .slice(0, 10)
        .map(([gameId, { averageScore, title, thumbnail }]) => ({
          gameId,
          score: averageScore,
          title,
          thumbnail,
        }));

      setTopScores(sortedScores);
    }
  }, []);

  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-6 text-black">
        <h1 className="text-4xl font-bold text-center mb-8">Best Games</h1>
        <h1 className="text-2xl font-bold text-center mb-8">By Ratings</h1>
        <ul className="space-y-6 mt-6">
          {topScores.length > 0 ? (
            topScores.map(({ gameId, score, title, thumbnail }, index) => (
              <li key={gameId} className="border border-gray-300 bg-white p-4 rounded-lg shadow-lg flex justify-between items-center hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center">
                  <span className="text-2xl font-bold mr-4 text-blue-600">{index + 1}.</span>
                  <img src={thumbnail} alt={title} className="w-16 h-16 object-cover rounded-md mr-4" />
                  <div>
                    <p className="text-lg font-semibold">{title}</p>
                    <p className="text-md text-gray-600">Average Score: {score.toFixed(1)}</p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center">No reviews available to calculate scores.</p>
          )}
        </ul>
      </main>
    </div>
  );
};

export default TopScores;
