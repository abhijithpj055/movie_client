import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Select from 'react-select';
import {
  createMovie,
  updateMovie,
  deleteMovie,
  getMovies,
  createDirector,
  getDirectors,
  updateDirector,
  deleteDirector,
  createActor,
  getActors,
  updateActor,
  deleteActor,
  createLanguage,
  getLanguages,
  updateLanguage,
  deleteLanguage,
  getUsers,
  deleteUser
} from '../services/api';
import Button from '../components/Button';
import MovieCard from '../components/MovieCard';



const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('movies');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingMovieId, setEditingMovieId] = useState(null);






  // Users
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');





  // Movies state
  const [movies, setMovies] = useState([]);
    const [movieSearch, setMovieSearch] = useState('');
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    release_date: '',
    rating: 0,
    isPremium: false,
    imageFile: null,
    director: '',
    actors: [],
    language: '',
  });

  // Directors
  const [directors, setDirectors] = useState([]);
  const [directorName, setDirectorName] = useState('');
  const [editingDirectorId, setEditingDirectorId] = useState(null);

  // Actors
  const [actors, setActors] = useState([]);
  const [actorName, setActorName] = useState('');
  const [editingActorId, setEditingActorId] = useState(null);

  // Languages
  const [languages, setLanguages] = useState([]);
  const [languageName, setLanguageName] = useState('');
  const [editingLanguageId, setEditingLanguageId] = useState(null);

  // Redirect non-admins
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchAll();
  }, [user, navigate]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [moviesRes, directorsRes, actorsRes, languagesRes, usersRes] = await Promise.all([
        getMovies(),
        getDirectors(),
        getActors(),
        getLanguages(),
        getUsers(),
      ]);
      setMovies(moviesRes.data);
      setDirectors(directorsRes.data);
      setActors(actorsRes.data);
      setLanguages(languagesRes.data);
      setUsers(usersRes.data.users || usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingUsers(false);
    }
  };

  // ----------------- Movie Handlers -----------------
  const handleMovieChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') setMovieForm({ ...movieForm, imageFile: files[0] });
    else if (type === 'checkbox') setMovieForm({ ...movieForm, [name]: checked });
    else setMovieForm({ ...movieForm, [name]: value });
  };
  const handleDeleteMovie = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await deleteMovie(id);
      setMovies(movies.filter(m => m._id !== id)); // remove from state
    } catch (err) {
      console.error(err);
    }
  };
  const startEditMovie = (movie) => {
    setEditingMovieId(movie._id);
    setMovieForm({
      title: movie.title,
      description: movie.description,
      release_date: movie.release_date?.split('T')[0] || '', // format date for input
      rating: movie.rating,
      isPremium: movie.isPremium,
      imageFile: null, // leave null, user can choose to upload new image
      director: movie.director?._id || '',
      actors: movie.actors?.map(a => a._id) || [],
      language: movie.language?._id || '',
    });
  };



  const handleMovieSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setSuccessMessage('');

  try {
    const formData = new FormData();
    formData.append('title', movieForm.title);
    formData.append('description', movieForm.description);
    formData.append('release_date', movieForm.release_date);
    formData.append('rating', movieForm.rating);
    formData.append('isPremium', movieForm.isPremium);
    formData.append('director', movieForm.director);
    formData.append('language', movieForm.language);
    formData.append('actors', JSON.stringify(movieForm.actors)); // important

    if (movieForm.imageFile) formData.append('image', movieForm.imageFile);

    let res;
    if (editingMovieId) {
      res = await updateMovie(editingMovieId, formData);
      setMovies(movies.map(m => (m._id === editingMovieId ? res.data : m)));
      setSuccessMessage('Movie updated successfully!');
      setEditingMovieId(null);
    } else {
      res = await createMovie(formData);
      setMovies([...movies, res.data]);
      setSuccessMessage('Movie added successfully!');
    }

    setMovieForm({
      title: '',
      description: '',
      release_date: '',
      rating: 0,
      isPremium: false,
      imageFile: null,
      director: '',
      actors: [],
      language: '',
    });

    setTimeout(() => setSuccessMessage(''), 3000);

  } catch (err) {
    console.error('Error submitting movie:', err);
    alert(err.response?.data?.message || 'Failed to submit movie');
  } finally {
    setSubmitting(false);
  }
};


  // ----------------- Generic CREATE -----------------
  const handleCreateDirector = async (e) => {
    e.preventDefault();
    try {
      if (editingDirectorId) {
        const res = await updateDirector(editingDirectorId, { name: directorName });
        setDirectors(directors.map(d => (d._id === editingDirectorId ? res.data : d)));
        setEditingDirectorId(null);
      } else {
        const res = await createDirector({ name: directorName });
        setDirectors([...directors, res.data]);
      }
      setDirectorName('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateActor = async (e) => {
    e.preventDefault();
    try {
      if (editingActorId) {
        const res = await updateActor(editingActorId, { name: actorName });
        setActors(actors.map(a => (a._id === editingActorId ? res.data : a)));
        setEditingActorId(null);
      } else {
        const res = await createActor({ name: actorName });
        setActors([...actors, res.data]);
      }
      setActorName('');
    } catch (err) {
      console.error(err);
    }
  };
  const actorOptions = actors.map(actor => ({
  value: actor._id,
  label: actor.name
}));

  const handleCreateLanguage = async (e) => {
  e.preventDefault();
  try {
    if (editingLanguageId) {
      const res = await updateLanguage(editingLanguageId, { name: languageName });
      setLanguages(languages.map(l => (l._id === editingLanguageId ? res.data : l)));
      setEditingLanguageId(null);
    } else {
      const res = await createLanguage({ name: languageName });
      setLanguages([...languages, res.data]);
    }
    setLanguageName('');
  } catch (err) {
    console.error(err);
  }
};


  // ----------------- DELETE -----------------
  const handleDeleteDirector = async (id) => {
    try {
      await deleteDirector(id);
      setDirectors(directors.filter(d => d._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleDeleteActor = async (id) => {
    try {
      await deleteActor(id);
      setActors(actors.filter(a => a._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleDeleteLanguage = async (id) => {
    try {
      await deleteLanguage(id);
      setLanguages(languages.filter(l => l._id !== id));
    } catch (err) { console.error(err); }
  };
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);  // call API
      setUsers(users.filter(u => u._id !== id)); // update state
    } catch (err) {
      console.error(err);
    }
  };


  // ----------------- EDIT -----------------
  const startEditDirector = (d) => {
    setEditingDirectorId(d._id);
    setDirectorName(d.name);
  };
  const startEditActor = (a) => {
    setEditingActorId(a._id);
    setActorName(a.name);
  };
const startEditLanguage = (l) => {
  setEditingLanguageId(l._id);
  setLanguageName( l.name ); 
};


  if (!user || user.role !== 'admin') return null;

  // ----------------- RENDER -----------------
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>

        {/* Section Tabs */}
        <div className="flex gap-4 mb-6">
          {['movies', 'directors', 'actors', 'languages', 'users'].map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 rounded ${activeSection === section ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}


        </div>

        {/* ----------------- MOVIES ----------------- */}
        {activeSection === 'movies' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {editingMovieId ? 'Edit Movie' : 'Add New Movie'}
              </h2>
              {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{successMessage}</div>}

              {/* FIXED: only one <form> here */}
              <form onSubmit={handleMovieSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block mb-1 font-semibold dark:text-white">Title</label>
                  <input id="title" name="title" value={movieForm.title} onChange={handleMovieChange} required={!editingMovieId} className="w-full px-3 py-2 border rounded" />
                </div>

                <div>
                  <label htmlFor="description" className="block mb-1 font-semibold dark:text-white">Description</label>
                  <textarea id="description" name="description" value={movieForm.description} onChange={handleMovieChange} required className="w-full px-3 py-2 border rounded" />
                </div>

                <div>
                  <label htmlFor="image" className="block mb-1 font-semibold dark:text-white">Poster Image</label>
                  <input id="image" type="file" name="image" onChange={handleMovieChange} required={!editingMovieId} className="w-full px-3 py-2 border rounded" />
                </div>

                <div>
                  <label htmlFor="release_date" className="block mb-1 font-semibold dark:text-white">Release Date</label>
                  <input id="release_date" type="date" name="release_date" value={movieForm.release_date} onChange={handleMovieChange} className="w-full px-3 py-2 border rounded" />
                </div>

                <div>
                  <label htmlFor="rating" className="block mb-1 font-semibold dark:text-white">Rating</label>
                  <input id="rating" type="number" name="rating" min="0" max="5" step="0.1" value={movieForm.rating} onChange={handleMovieChange} className="w-full px-3 py-2 border rounded" />
                </div>

                <div className="flex items-center gap-2">
                  <input id="isPremium" type="checkbox" name="isPremium" checked={movieForm.isPremium} onChange={handleMovieChange} />
                  <label htmlFor="isPremium" className="font-semibold dark:text-white">Premium Content</label>
                </div>

                <div>
                  <label htmlFor="director" className='dark:text-white mb-1 font-semibold '>Director</label>
                  <select id="director" value={movieForm.director} onChange={e => setMovieForm({ ...movieForm, director: e.target.value })} required={!editingMovieId} className="w-full px-3 py-2 border rounded">
                    <option value="">Select Director</option>
                    {directors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>

            <div>
  <label htmlFor="actors" className="dark:text-white mb-1 font-semibold">Actors</label>
  <Select
    id="actors"
    isMulti
    options={actorOptions}
    value={actorOptions.filter(option => movieForm.actors.includes(option.value))}
    onChange={(selectedOptions) => {
      setMovieForm({
        ...movieForm,
        actors: selectedOptions.map(option => option.value)
      });
    }}
    className="text-black"
  />
</div>

                <div>
                  <label htmlFor="language" className='dark:text-white mb-1 font-semibold '>Language</label>
                  <select id="language" value={movieForm.language} onChange={e => setMovieForm({ ...movieForm, language: e.target.value })} required={!editingMovieId} className="w-full px-3 py-2 border rounded">
                    <option value="">Select Language</option>
                    {languages.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
                  </select>
                </div>

                <Button
                  type="submit"
                  text={submitting ? (editingMovieId ? 'Updating Movie...' : 'Adding Movie...') : (editingMovieId ? 'Update Movie' : 'Add Movie')}
                  disabled={submitting}
                  className="w-full"
                />
              </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Current Movies ({movies.length})</h2>
             
<input
  type="text"
  placeholder="Search movies..."
  value={movieSearch}
  onChange={(e) => setMovieSearch(e.target.value)}
  className="w-full px-3 py-2 border rounded mb-4"
/>


              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {movies
                   .filter(m => m.title.toLowerCase().includes(movieSearch.toLowerCase()))
                  .map(movie => (
                    <div key={movie._id} className="transform scale-75">
                      <MovieCard
                        id={movie._id}
                        title={movie.title}
                        posterUrl={movie.image}
                        rating={movie.rating}
                        isPremium={movie.isPremium}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => startEditMovie(movie)}
                          className="text-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMovie(movie._id)}
                          className="text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              )}
            </div>
          </div>
        )}

        {activeSection === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Users</h2>
<input
  type="text"
  placeholder="Search users..."
  value={userSearch}
  onChange={(e) => setUserSearch(e.target.value)}
  className="w-full px-3 py-2 border rounded mb-4"
/>


            {loadingUsers ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <ul className="space-y-2 max-h-96 overflow-y-auto">
                {
                 (users || []).filter(u =>
  (u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
   u.email?.toLowerCase().includes(userSearch.toLowerCase()))
)

                .map(u => (
                  <li key={u._id} className="flex justify-between items-center border-b py-2">
                    <div>
                      <p><strong>Name:</strong> {u.name}</p>
                      <p><strong>Email:</strong> {u.email}</p>
                      <p><strong>Role:</strong> {u.role}</p>
                      <p><strong>Status:</strong> {u.status}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="text-red-500 font-semibold"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}


        {/* DIRECTORS */}
        {activeSection === 'directors' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Directors</h2>
            <form onSubmit={handleCreateDirector} className="flex gap-2 mb-4">
              <input value={directorName} onChange={(e) => setDirectorName(e.target.value)} placeholder="Director Name" required className="px-3 py-2 border rounded w-full" />
              <Button type="submit" text={editingDirectorId ? "Update" : "Add"} />
            </form>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {directors.map(d => (
                <li key={d._id} className="flex justify-between items-center">
                  <span>{d.name}</span>
                  <div className="flex gap-2">
                    <button onClick={() => startEditDirector(d)} className="text-yellow-500">Edit</button>
                    <button onClick={() => handleDeleteDirector(d._id)} className="text-red-500">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ACTORS */}
        {activeSection === 'actors' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Actors</h2>
            <form onSubmit={handleCreateActor} className="flex gap-2 mb-4">
              <input value={actorName} onChange={(e) => setActorName(e.target.value)} placeholder="Actor Name" required className="px-3 py-2 border rounded w-full" />
              <Button type="submit" text={editingActorId ? "Update" : "Add"} />
            </form>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {actors.map(a => (
                <li key={a._id} className="flex justify-between items-center">
                  <span>{a.name}</span>
                  <div className="flex gap-2">
                    <button onClick={() => startEditActor(a)} className="text-yellow-500">Edit</button>
                    <button onClick={() => handleDeleteActor(a._id)} className="text-red-500">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* LANGUAGES */}
        {activeSection === 'languages' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Languages</h2>
            <form onSubmit={handleCreateLanguage} className="flex gap-2 mb-4">
              <input value={languageName} onChange={(e) => setLanguageName(e.target.value)} placeholder="Language" required className="px-3 py-2 border rounded w-full" />
              <Button type="submit" text={editingLanguageId ? "Update" : "Add"} />
            </form>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {languages.map(l => (
                <li key={l._id} className="flex justify-between items-center">
                  <span>{l.language || l.name}</span>
                  <div className="flex gap-2">
                    <button onClick={() => startEditLanguage(l)} className="text-yellow-500">Edit</button>
                    <button onClick={() => handleDeleteLanguage(l._id)} className="text-red-500">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
