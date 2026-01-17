import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SplashScreen from '../components/SplashScreen';

export const TOKEN_KEY = 'access_token';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Error mapping for user-friendly messages
const errorMessages = {
  USER_NOT_FOUND: 'No account found with this email.',
  INVALID_PASSWORD: 'Incorrect password. Please try again.',
  EMAIL_ALREADY_EXISTS: 'This email is already registered.',
  DEFAULT: 'Something went wrong. Please try again.'
};

// Axios interceptor to auto-logout on 401
const attachAuthInterceptor = (logout) => {
  const id = axios.interceptors.response.use(
    (res) => res,
    async (err) => {
      if (err.response?.status === 401) {
        await logout();
      }
      return Promise.reject(err);
    }
  );
  return () => axios.interceptors.response.eject(id);
};

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [isAdminLogin, setIsAdminLogin] = useState(false);

   const isAuthenticated = !!user;
   const isAdmin = user?.role === 'admin';
   const isAdminMode = isAdminLogin && isAdmin;

  useEffect(() => {
    const detach = attachAuthInterceptor(logout);
    restoreAuth();

    return () => detach();
  }, []);

  // Restore auth on app startup
  const restoreAuth = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) return;

      const res = await axios.get('http://localhost:8000/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      // On restore, default to user mode
      setIsAdminLogin(false);
    } catch (err) {
      await AsyncStorage.removeItem(TOKEN_KEY);
      console.error('Auth restore failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Login method
  const login = async ({ email, password, isAdminLogin = false }) => {
    try {
      const res = await axios.post('http://localhost:8000/auth/login', { email, password });
      const { access_token } = res.data;

      await AsyncStorage.setItem(TOKEN_KEY, access_token);

      const profile = await axios.get('http://localhost:8000/users/profile', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      setUser(profile.data);
      setIsAdminLogin(isAdminLogin);

      return { success: true, user: profile.data };
    } catch (err) {
      const code = err.response?.data?.code;
      const message = errorMessages[code] || err.response?.data?.detail || errorMessages.DEFAULT;
      return { success: false, error: message };
    }
  };

  // Signup method
  const signup = async (userData) => {
    try {
      const res = await axios.post('http://localhost:8000/auth/signup', userData);
      return { success: true, message: res.data.message };
    } catch (err) {
      const code = err.response?.data?.code;
      const message = errorMessages[code] || err.response?.data?.detail || errorMessages.DEFAULT;
      return { success: false, error: message };
    }
  };

  // Logout method
  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setIsAdminLogin(false);
  };

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isAdminMode,
        loading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
