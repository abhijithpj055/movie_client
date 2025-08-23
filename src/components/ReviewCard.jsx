const ReviewCard = ({ user, rating, comment, createdAt }) => {
  const renderStars = (rating) => {
    return '⭐'.repeat(Math.min(rating, 5));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900 dark:text-white">{user}</h4>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(createdAt)}
        </span>
      </div>
      
      <div className="flex items-center mb-2">
        <span className="mr-2">{renderStars(rating)}</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {rating}/5
        </span>
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 text-sm">
        {comment}
      </p>
    </div>
  );
};

export default ReviewCard;