import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

/**
 * Hardcoded fallback user.
 * If the backend is unreachable or auto-login fails,
 * the app still works with this default identity.
 */
const FALLBACK_USER = {
  id: 'default-john',
  name: 'John Doe',
  username: 'john',
  email: 'john@cal.com',
  avatar: '',
  plan: 'PRO',
  timezone: 'Asia/Kolkata',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  /**
   * Auto-login as John — tries existing token first, then fetches a fresh one.
   * If everything fails, falls back to the hardcoded user so the app never breaks.
   */
  const initAuth = async () => {
    // 1. Try existing token
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await api.get('/auth/me');
        setUser(res.data);
        setLoading(false);
        return;
      }
    } catch {
      localStorage.removeItem('token');
    }

    // 2. Auto-login as John
    try {
      const res = await api.get('/auth/auto-login');
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    } catch (err) {
      console.warn('Auto-login failed, using fallback user:', err.message);
      setUser(FALLBACK_USER);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return true;
    } catch { return false; }
  };

  const signup = async (name, username, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, username, email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return true;
    } catch { return false; }
  };

  const loginWithGoogle = async (credential) => {
    try {
      const res = await api.post('/auth/google', { token: credential });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return true;
    } catch { return false; }
  };

  // Logout just re-auto-logs in as John
  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    try {
      const res = await api.get('/auth/auto-login');
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    } catch {
      setUser(FALLBACK_USER);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
