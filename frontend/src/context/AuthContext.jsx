import { createContext, useContext, useEffect, useState } from "react";
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
    const storedToken = localStorage.getItem("token");

    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      // Try to fetch user info
      await fetchUserInfo(storedToken);
    } else {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }

    setLoading(false);
  };

  const fetchUserInfo = async (authToken = token) => {
    if (!authToken) return;

    try {
      // Try admin endpoint first
      const response = await apiClient.get('/admin/me');
      setUser({ ...response.data, isAdmin: true });
      return;
    } catch (error) {
      // Not admin or error, try regular user endpoint
      try {
        const response = await apiClient.get('/users/profile');
        setUser({ ...response.data, isAdmin: false });
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        setUser(null);
      }
    }
  };

  const login = async (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    await fetchUserInfo(newToken);
  };

  const logout = async () => {
    localStorage.removeItem("token");
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