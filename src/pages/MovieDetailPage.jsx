import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieById, addReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReviewCard from '../components/ReviewCard';
import Button from '../components/Button';
import Loader from '../components/Loader';

const MovieDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const response = await getMovieById(id);
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewChange = (e) => {
    setReviewForm({
      ...reviewForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const review = {
        user: user.name,
        rating: parseInt(reviewForm.rating),
        comment: reviewForm.comment
      };

      await addReview(id, review);
      
      // Add the review to the local state
      setMovie(prev => ({
        ...prev,
        reviews: [...prev.reviews, {
          ...review,
          id: Date.now(),
          createdAt: new Date().toISOString()
        }]
      }));
      
      // Clear form
      setReviewForm({
        rating: 5,
        comment: ''
      });
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Movie not found</h2>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.min(rating, 5));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            
            <div className="md:w-2/3 p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {movie.title}
                </h1>
                {movie.isPremium && (
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                    Premium
                  </span>
                )}
              </div>
              
              <div className="flex items-center mb-4">
                <span className="mr-2">{renderStars(movie.rating)}</span>
                <span className="text-lg text-gray-600 dark:text-gray-400">
                  {movie.rating.toFixed(1)}/5
                </span>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {movie.description}
              </p>
            </div>
          </div>
        </div>

        {user && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Write a Review
            </h2>
            
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating
                </label>
                <select
                  id="rating"
                  name="rating"
                  value={reviewForm.rating}
                  onChange={handleReviewChange}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Review
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows="4"
                  value={reviewForm.comment}
                  onChange={handleReviewChange}
                  required
                  placeholder="Write your review here..."
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <Button
                type="submit"
                text={submitting ? "Submitting..." : "Submit Review"}
                disabled={submitting}
              />
            </form>
          </div>
        )}

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Reviews ({movie.reviews.length})
          </h2>
          
          {movie.reviews.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No reviews yet. Be the first to review this movie!
            </p>
          ) : (
            <div>
              {movie.reviews.map(review => (
                <ReviewCard
                  key={review.id}
                  user={review.user}
                  rating={review.rating}
                  comment={review.comment}
                  createdAt={review.createdAt}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;