import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('spotify_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('spotify_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/signin', { email, password });
    const userData = {
      _id: res.data._id,
      username: res.data.username,
      email: res.data.email,
      role: res.data.role,
    };
    setUser(userData);
    localStorage.setItem('spotify_user', JSON.stringify(userData));
    localStorage.setItem('spotify_token', res.data.token);
    return userData;
  };

  const register = async (username, email, password, role) => {
    const res = await api.post('/auth/register', { username, email, password, role });
    const userData = {
      _id: res.data.user._id,
      username: res.data.user.username,
      email: res.data.user.email,
      role: res.data.user.role,
    };
    setUser(userData);
    localStorage.setItem('spotify_user', JSON.stringify(userData));
    localStorage.setItem('spotify_token', res.data.token);
    return userData;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    localStorage.removeItem('spotify_user');
    localStorage.removeItem('spotify_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
