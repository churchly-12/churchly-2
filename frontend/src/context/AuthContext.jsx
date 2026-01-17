import { createContext, useContext, useEffect, useState } from "react";
import apiClient, { attachAuthInterceptors } from "../api/apiClient";

export const TOKEN_KEY = "access_token";

const AuthContext = createContext(null);

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiresInMinutes = Math.round((payload.exp * 1000 - Date.now()) / 60000);
    console.log("JWT expires in", expiresInMinutes, "minutes");
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
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      // Try to fetch user info
      await fetchUserInfo(storedToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }

    setLoading(false);
  };

  const fetchUserInfo = async (authToken = token) => {
    if (!authToken) return;

    try {
      const response = await apiClient.get('/users/profile');
      setUser({ ...response.data, isAdmin: false });
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      setUser(null);
    }
  };

  const login = async (newToken) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    await fetchUserInfo(newToken);
  };

  const logout = async () => {
    localStorage.removeItem(TOKEN_KEY);
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