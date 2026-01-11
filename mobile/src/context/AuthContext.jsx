import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient, { attachAuthInterceptors } from "../api/apiClient";

const AuthContext = createContext(null);

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
    attachAuthInterceptors(logout);
  }, []);

  const restoreSession = async () => {
    const storedToken = await AsyncStorage.getItem("token");

    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      // Try to fetch user info
      await fetchUserInfo(storedToken);
    } else {
      await AsyncStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }

    setLoading(false);
  };

  const fetchUserInfo = async (authToken = token, forceAdmin = null) => {
    if (!authToken) return;

    if (forceAdmin === true) {
      try {
        const response = await apiClient.get('/admin/me');
        setUser({ ...response.data, isAdmin: true });
        return;
      } catch (error) {
        console.error('Failed to fetch admin user info:', error);
        setUser(null);
      }
    } else if (forceAdmin === false) {
      try {
        const response = await apiClient.get('/users/profile');
        setUser({ ...response.data, isAdmin: false });
        return;
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        setUser(null);
      }
    } else {
      // Auto detect
      try {
        const response = await apiClient.get('/admin/me');
        setUser({ ...response.data, isAdmin: true });
        return;
      } catch (error) {
        try {
          const response = await apiClient.get('/users/profile');
          setUser({ ...response.data, isAdmin: false });
        } catch (error) {
          console.error('Failed to fetch user info:', error);
          setUser(null);
        }
      }
    }
  };

  const login = async (credentials, isAdminLogin = null) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);

      const response = await apiClient.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const newToken = response.data.access_token;
      await AsyncStorage.setItem("token", newToken);
      setToken(newToken);
      await fetchUserInfo(newToken, isAdminLogin);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isReadOnlyAdmin: user?.is_read_only_admin || false,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);