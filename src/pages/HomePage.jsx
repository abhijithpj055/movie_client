import { Link } from 'react-router-dom';
import Button from '../components/Button';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to MovieApp
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover amazing movies, read reviews, and share your thoughts with our community.
          </p>
          
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link to="/movies">
              <Button text="Browse Movies" className="w-full sm:w-auto" />
            </Link>
            <Link to="/signup">
              <Button 
                text="Join Now" 
                variant="outline"
                className="w-full sm:w-auto"
              />
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎬</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Vast Collection
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Explore thousands of movies from different genres and eras.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              User Reviews
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Read honest reviews and ratings from our community.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👑</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Premium Content
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Access exclusive premium movies and content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;