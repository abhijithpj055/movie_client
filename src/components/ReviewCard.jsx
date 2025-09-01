const ReviewCard = ({ user, rating, comment, createdAt }) => {
  const renderStars = (rating) => {
    const r = Number(rating) || 0; // make sure it's a number
    return '⭐'.repeat(Math.min(r, 5));
  };

  const formatDate = (dateString) => {
    if (!dateString) return ''; // fallback
    const date = new Date(dateString);
    if (isNaN(date)) return ''; // handle invalid date
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900 dark:text-white">{user || 'Anonymous'}</h4>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(createdAt)}
        </span>
      </div>
      <div className="flex items-center mb-2">
        <span className="mr-2">{renderStars(rating)}</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">{Number(rating) || 0}/5</span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-sm">{comment || ''}</p>
    </div>
  );
};

export default ReviewCard;
