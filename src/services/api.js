import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api"
});

// Mock data
const mockMovies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    posterUrl: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300",
    rating: 4.9,
    isPremium: true
  },
  {
    id: 2,
    title: "The Godfather",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    posterUrl: "https://images.pexels.com/photos/7991721/pexels-photo-7991721.jpeg?auto=compress&cs=tinysrgb&w=300",
    rating: 4.7,
    isPremium: false
  },
  {
    id: 3,
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    posterUrl: "https://images.pexels.com/photos/7991580/pexels-photo-7991580.jpeg?auto=compress&cs=tinysrgb&w=300",
    rating: 4.8,
    isPremium: true
  },
  {
    id: 4,
    title: "Pulp Fiction",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
    posterUrl: "https://images.pexels.com/photos/7991722/pexels-photo-7991722.jpeg?auto=compress&cs=tinysrgb&w=300",
    rating: 4.6,
    isPremium: false
  }
];

const mockReviews = {
  1: [
    {
      id: 1,
      user: "John Doe",
      rating: 5,
      comment: "Absolutely incredible movie! The storytelling is phenomenal.",
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      user: "Jane Smith",
      rating: 4,
      comment: "Great film with amazing character development.",
      createdAt: "2024-01-10T14:20:00Z"
    }
  ],
  2: [
    {
      id: 3,
      user: "Mike Johnson",
      rating: 5,
      comment: "A masterpiece of cinema. Marlon Brando's performance is legendary.",
      createdAt: "2024-01-12T09:15:00Z"
    }
  ]
};

let moviesList = [...mockMovies];

// Mock API functions
export const getMovies = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: moviesList });
    }, 600);
  });
};

export const getMovieById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const movie = moviesList.find(m => m.id === parseInt(id));
      if (movie) {
        resolve({ 
          data: {
            ...movie,
            reviews: mockReviews[id] || []
          }
        });
      } else {
        reject(new Error('Movie not found'));
      }
    }, 500);
  });
};

export const createMovie = (movie) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMovie = {
        ...movie,
        id: moviesList.length + 1,
        rating: parseFloat(movie.rating) || 0
      };
      moviesList.push(newMovie);
      resolve({ data: newMovie });
    }, 800);
  });
};

export const addReview = (movieId, review) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReview = {
        ...review,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      if (!mockReviews[movieId]) {
        mockReviews[movieId] = [];
      }
      mockReviews[movieId].push(newReview);
      
      resolve({ data: newReview });
    }, 500);
  });
};

export default api;