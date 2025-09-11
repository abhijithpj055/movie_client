import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // token save cheythirikkunnath login kazhinjappol
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------- MOVIES ----------------
export const getMovies = async () => await api.get("/movies");
export const getMovieById = async (id) => await api.get(`/movies/${id}`);
export const createMovie = async (formData) =>
  await api.post("/movies", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateMovie = async (id, formData) =>
  await api.put(`/movies/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteMovie = async (id) => await api.delete(`/movies/${id}`);

// ---------------- DIRECTORS ----------------
export const getDirectors = async () => await api.get("/directors");
export const getDirectorById = async (id) => await api.get(`/directors/${id}`);
export const createDirector = async (data) => await api.post("/directors", data);
export const updateDirector = async (id, data) => await api.put(`/directors/${id}`, data);
export const deleteDirector = async (id) => await api.delete(`/directors/${id}`);

// ---------------- ACTORS ----------------
export const getActors = async () => await api.get("/actors");
export const getActorById = async (id) => await api.get(`/actors/${id}`);
export const createActor = async (data) => await api.post("/actors", data);
export const updateActor = async (id, data) => await api.put(`/actors/${id}`, data);
export const deleteActor = async (id) => await api.delete(`/actors/${id}`);

// ---------------- LANGUAGES ----------------
export const getLanguages = async () => await api.get("/languages");
export const getLanguageById = async (id) => await api.get(`/languages/${id}`);
export const createLanguage = async (data) => await api.post("/languages", data);
export const updateLanguage = async (id, data) => await api.put(`/languages/${id}`, data);
export const deleteLanguage = async (id) => await api.delete(`/languages/${id}`);

// ---------------- REVIEWS ----------------
export const addReview = async (review) => {
  return await api.post("/reviews", {
    movie_id: review.movie_id,
    rating: review.rating,
    comment: review.comment,
  });
};
export const updateReview = async (id, data) => {
  return await api.put(`/reviews/${id}`, data);
};

export const deleteReview = async (id) => {
  return await api.delete(`/reviews/${id}`);
};

// Users API
// api.js
export const getUsers = async () => await api.get("/user/admin/all-users");



export const deleteUser = async (id) => await api.delete(`/user/admin/delete-user/${id}`);




export default api;
