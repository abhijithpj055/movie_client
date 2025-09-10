import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieById, addReview,updateReview, deleteReview } from '../services/api';
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
  const [editingReviewId, setEditingReviewId] = useState(null);
const [editForm, setEditForm] = useState({ rating: 5, comment: '' });


  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const response = await getMovieById(id);
      // ✅ Always make sure reviews exists as an array
      setMovie({
        ...response.data,
        reviews: response.data.reviews || []
      });
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
      movie_id: id,
      user_id: user?.id,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    };

    // Save to backend
    const savedReview = await addReview(review);

    // Normalize for frontend
    const normalizedReview = {
      _id: savedReview.data._id,
      comment: savedReview.data.comment,         // ✅ ensure comment is kept
      rating: Number(savedReview.data.rating),   // ✅ ensure numeric
      createdAt: savedReview.data.createdAt,     // ✅ keep timestamp
      user_id: { name: user.name },         // ✅ show current user’s name
    };
   
    // Update state
    setMovie(prev => ({
      ...prev,
      reviews: [...(prev.reviews || []), normalizedReview],
    }));

    // Reset form
    setReviewForm({ rating: 5, comment: '' });
  } catch (error) {
    console.error("Error submitting review:", error);
  } finally {
    setSubmitting(false);
  }
};

 const handleEdit = (review) => {
  setEditingReviewId(review._id);
  setEditForm({ rating: review.rating, comment: review.comment });
};

const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const response = await updateReview(editingReviewId, {
      rating: editForm.rating,
      comment: editForm.comment,
    });

    const updatedReview = {
      ...response.data,
      user_id: { name: user.name }, 
    };

    setMovie((prev) => ({
      ...prev,
      reviews: prev.reviews.map((r) =>
        r._id === editingReviewId ? updatedReview : r
      ),
    }));

    setEditingReviewId(null);
  } catch (err) {
    console.error("Error updating review:", err);
  }
};

const handleDelete = async (id) => {
  try {
    await deleteReview(id);
    setMovie((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((r) => r._id !== id),
    }));
  } catch (err) {
    console.error("Error deleting review:", err);
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
                src={movie.image}
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
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p><span className="font-semibold">Director:</span> {movie.director?.name}</p>
                <p><span className="font-semibold">Actors:</span> {movie.actors.map(a => a.name).join(', ')}</p>
              </div>
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
            Reviews ({movie?.reviews?.length || 0})
          </h2>
          
          {!movie?.reviews || movie.reviews.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No reviews yet. Be the first to review this movie!
            </p>
          ) : (
            <div>
              {movie.reviews.map((review) => {
  const isOwnReview = user && review.user_id?.name === user.name;

  if (editingReviewId === review._id) {
    return (
      <form key={review._id} onSubmit={handleUpdate} className="mb-4">
        <select
          name="rating"
          value={editForm.rating}
          onChange={(e) =>
            setEditForm((prev) => ({ ...prev, rating: e.target.value }))
          }
          className="mb-2 w-full p-2 rounded"
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r} Star{r > 1 && 's'}</option>
          ))}
        </select>
        <textarea
          name="comment"
          value={editForm.comment}
          onChange={(e) =>
            setEditForm((prev) => ({ ...prev, comment: e.target.value }))
          }
          className="w-full p-2 mb-2 rounded"
        />
        <div className="space-x-2">
          <Button text="Update" type="submit" />
          <Button text="Cancel" type="button" onClick={() => setEditingReviewId(null)} />
        </div>
      </form>
    );
  }

  return (
    <ReviewCard
      key={review._id}
      user={review.user_id?.name}
      rating={review.rating}
      comment={review.comment}
      createdAt={review.createdAt}
      isOwnReview={isOwnReview}
      onEdit={() => handleEdit(review)}
      onDelete={() => handleDelete(review._id)}
    />
  );
})}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
