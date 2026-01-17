import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const TOKEN_KEY = "access_token";

// Attach 401 interceptor
const attachAuthInterceptors = (logout) => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        await logout();
      }
      return Promise.reject(error);
    }
  );
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  useEffect(() => {
    attachAuthInterceptors(logout);
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        // Verify token with backend
        const response = await axios.get('http://localhost:8000/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await AsyncStorage.removeItem(TOKEN_KEY);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials, isAdmin = false) => {
    const { email, password } = credentials;
    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        email,
        password
      });
      const { access_token, user_id } = response.data;
      await AsyncStorage.setItem(TOKEN_KEY, access_token);
      // Fetch user data after login
      const userResponse = await axios.get('http://localhost:8000/users/profile', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      setUser(userResponse.data);
      setIsAuthenticated(true);
      setIsAdminLogin(isAdmin);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post('http://localhost:8000/auth/signup', userData);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Signup failed' };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setIsAuthenticated(false);
    setIsAdminLogin(false);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    isAdminLogin,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};