const ReviewCard = ({
  user,
  rating,
  comment,
  createdAt,
  isOwnReview = false,
  onEdit,
  onDelete
}) => {
  const renderStars = (rating) => {
    const r = Number(rating) || 0;
    return '⭐'.repeat(Math.min(r, 5));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return '';
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

      {isOwnReview && (
        <div className="mt-3 space-x-2">
          <button
            onClick={onEdit}
            className="text-blue-500 hover:underline text-sm"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:underline text-sm"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
