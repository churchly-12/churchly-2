import { createContext, useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient, { attachAuthInterceptors } from "../api/apiClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });

  useEffect(() => {
    restoreSession();
    attachAuthInterceptors(logout);
  }, []);

  const login = async ({ email, password }) => {
    const res = await apiClient.post("/auth/login", { email, password });
    const token = res.data.access_token;

    await AsyncStorage.setItem("access_token", token);

    const decoded = jwtDecode(token);

    setAuth({
      isAuthenticated: true,
      user: {
        id: decoded.sub,
        role: decoded.role
      },
      isLoading: false
    });
  };

  const restoreSession = async () => {
    const token = await AsyncStorage.getItem("access_token");

    if (!token) {
      setAuth(a => ({ ...a, isLoading: false }));
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        await AsyncStorage.removeItem("access_token");
        setAuth({ isAuthenticated: false, user: null, isLoading: false });
        return;
      }

      setAuth({
        isAuthenticated: true,
        user: {
          id: decoded.sub,
          role: decoded.role
        },
        isLoading: false
      });

    } catch {
      await AsyncStorage.removeItem("access_token");
      setAuth({ isAuthenticated: false, user: null, isLoading: false });
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("access_token");
    setAuth({
      isAuthenticated: false,
      user: null,
      isLoading: false
    });
  };

  console.log("AUTH:", auth);

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        login,
        logout,
        restoreSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);