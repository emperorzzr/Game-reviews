"use client"; // Keep this line
import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const GamePage = ({ genres, platforms, games }) => {
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [gameName, setGameName] = useState('');
  const [reviews, setReviews] = useState({});

  
  useEffect(() => {
    //localStorage.clear();
    const savedReviews = localStorage.getItem('gameReviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesGenre = selectedGenre ? game.genre === selectedGenre : true;
      const matchesPlatform = selectedPlatform ? game.platform === selectedPlatform : true;
      const matchesName = gameName ? game.title.toLowerCase().includes(gameName.toLowerCase()) : true;
      return matchesGenre && matchesPlatform && matchesName;
    });
  }, [games, selectedGenre, selectedPlatform, gameName]);

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedPlatform('');
    setGameName('');
  };

  const handleReviewSubmit = (gameId, newReview, editingIndex = null) => {
    const gameDetails = games.find(game => game.id === gameId);
  
    setReviews((prevReviews) => {
      const gameReviews = prevReviews[gameId] || [];
      const updatedGameReviews = [...gameReviews];
  
      const reviewData = {
        ...newReview,
        title: gameDetails.title,
        thumbnail: gameDetails.thumbnail,
      };
  
      if (editingIndex !== null) {
        updatedGameReviews[editingIndex] = reviewData;
      } else {
        const isDuplicate = updatedGameReviews.some(
          review => review.comment === newReview.comment && review.score === newReview.score
        );
  
        if (!isDuplicate) {
          updatedGameReviews.push(reviewData);
        }
      }
  
      const updatedReviews = {
        ...prevReviews,
        [gameId]: updatedGameReviews,
      };
  
      localStorage.setItem('gameReviews', JSON.stringify(updatedReviews));
  
      return updatedReviews;
    });
  };
  

  const handleReviewDelete = (gameId, index) => {
    setReviews((prevReviews) => {
      const updatedReviews = { ...prevReviews };
      if (updatedReviews[gameId]) {
        updatedReviews[gameId] = updatedReviews[gameId].filter((_, i) => i !== index);
        
        // Remove the gameId key if it has no reviews left
        if (updatedReviews[gameId].length === 0) {
          delete updatedReviews[gameId]; // This removes the key
        }
      }
  
      localStorage.setItem('gameReviews', JSON.stringify(updatedReviews));
      console.log('Updated gameReviews after delete:', updatedReviews); // Log the updated reviews
  
      return updatedReviews;
    });
  };
  

  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-black mb-6">Game List</h1>
        <Filters 
          genres={genres} 
          platforms={platforms} 
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
          gameName={gameName} 
          setGameName={setGameName} 
          clearFilters={clearFilters} 
        />
        
        <ul className="space-y-6 mt-6">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <GameItem 
                key={game.id} 
                game={game} 
                reviews={reviews[game.id] || []} 
                onReviewSubmit={handleReviewSubmit} 
                onReviewDelete={handleReviewDelete}
              />
            ))
          ) : (
            <p>No games found matching your criteria.</p>
          )}
        </ul>
      </main>
    </div>
  );
};

const Filters = ({ 
  genres, 
  platforms, 
  selectedGenre, 
  setSelectedGenre, 
  selectedPlatform, 
  setSelectedPlatform, 
  gameName, 
  setGameName,
  clearFilters 
}) => {
  return (
    <div className="mb-4 flex flex-col space-y-4">
      <div className="flex space-x-4 text-black">
        <select 
          aria-label="Select Genre"
          className="border rounded-md p-2"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">Select Genre</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>

        <select 
          aria-label="Select Platform"
          className="border rounded-md p-2"
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
        >
          <option value="">Select Platform</option>
          {platforms.map((platform) => (
            <option key={platform} value={platform}>{platform}</option>
          ))}
        </select>

        <input 
          type="text" 
          className="border rounded-md p-2" 
          placeholder="Filter by game name" 
          value={gameName} 
          onChange={(e) => setGameName(e.target.value)} 
          aria-label="Filter by game name"
        />
      </div>

      <button 
        onClick={clearFilters} 
        className="mt-2 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition-colors duration-200"
      >
        Clear Filters
      </button>
    </div>
  );
};

const GameItem = ({ game, reviews, onReviewSubmit, onReviewDelete }) => {
  const [newComment, setNewComment] = useState('');
  const [newScore, setNewScore] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() && newScore > 0) {
      const reviewData = { comment: newComment, score: newScore };
      onReviewSubmit(game.id, reviewData, editingIndex); 
      setNewComment('');
      setNewScore(0);
      setEditingIndex(null); 
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewComment(reviews[index].comment);
    setNewScore(reviews[index].score);
  };

  const handleDelete = (index) => {
    onReviewDelete(game.id, index);
  };

  return (
    <li className="border rounded-lg shadow-lg p-4 flex flex-col bg-white hover:shadow-xl transition-shadow duration-200">
      <div className="flex space-x-4">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-32 h-32 object-cover rounded-md"
        />
        <div className="flex-1 text-black">
          <h2 className="text-xl font-semibold">{game.title}</h2>
          <p className="text-gray-600">{game.short_description}</p>
          <div className="mt-2">
            <p className="text-sm font-medium">Genre: {game.genre}</p>
            <p className="text-sm font-medium">Platform: {game.platform}</p>
            <p className="text-sm font-medium">Release Date: {game.release_date}</p>
          </div>
          <a
            href={game.game_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Play Now
          </a>
        </div>
      </div>

      <div className="mt-4 text-black">
        <h3 className="text-lg font-semibold">Reviews</h3>
        <ul className="space-y-2">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <li key={index} className="border p-2 rounded flex justify-between">
                <div>
                  <strong>Score: {review.score}</strong>
                  <p>{review.comment}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-blue-500 hover:underline"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-500 hover:underline"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </ul>
        <form onSubmit={handleSubmit} className="mt-2">
          <textarea 
            value={newComment} 
            onChange={(e) => setNewComment(e.target.value)} 
            className="border rounded-md p-2 w-full" 
            placeholder="Write a review..."
            rows="3"
          />
          <input 
            type="number" 
            min="1" 
            max="5" 
            value={newScore} 
            onChange={(e) => setNewScore(Number(e.target.value))} 
            className="border rounded-md p-2 mt-2 w-full" 
            placeholder="Score (1-5)"
          />
          <button 
            type="submit" 
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
          >
            {editingIndex !== null ? 'Update Review' : 'Submit Review'}
          </button>
        </form>
      </div>
    </li>
  );
};


export default GamePage;
