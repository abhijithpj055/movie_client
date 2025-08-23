// import { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem('auth_user');
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   const login = async (email, password) => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         // Mock login validation
//         if (email && password) {
//           const mockUser = {
//             name: email === 'admin@test.com' ? 'Admin User' : 'John Doe',
//             email,
//             role: email === 'admin@test.com' ? 'admin' : 'user',
//             token: 'mock-jwt-token'
//           };
//           setUser(mockUser);
//           resolve(mockUser);
//         } else {
//           reject(new Error('Invalid credentials'));
//         }
//       }, 800);
//     });
//   };

//   const signup = async (userData) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const newUser = {
//           name: userData.name,
//           email: userData.email,
//           role: userData.role.toLowerCase(),
//           token: 'mock-jwt-token'
//         };
//         setUser(newUser);
//         resolve(newUser);
//       }, 800);
//     });
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('auth_user');
//   };

//   useEffect(() => {
//     if (user) {
//       localStorage.setItem('auth_user', JSON.stringify(user));
//     }
//   }, [user]);

//   return (
//     <AuthContext.Provider value={{ user, login, signup, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // --- LOGIN ---
  const login = async ({ email, password }) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/user/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log("Login response:", res.data);

      const loggedUser = res.data.user;
      setUser(loggedUser);
      localStorage.setItem('auth_user', JSON.stringify(loggedUser));
      return loggedUser;
      
    } catch (err) {
      throw err.response?.data || new Error('Login failed');
    }
  };

  // --- SIGNUP ---
  const signup = async (userData) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/user/register`,
        userData,
        { withCredentials: true }
      );
      
    console.log("🔍 Signup Response:", res.data);

      const newUser = res.data.user;
      setUser(newUser);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      return newUser;
    } catch (err) {
      throw err.response?.data || new Error('Signup failed');
    }
  };

  // --- LOGOUT ---
  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
