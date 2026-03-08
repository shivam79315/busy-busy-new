import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getCurrentLocalUser,
  loginLocalUser,
  logoutLocalUser,
  registerLocalUser,
} from "./store-service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("store-auth-token"));
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (!token) {
        setUser(null);
        setIsBootstrapping(false);
        return;
      }

      try {
        const data = await getCurrentLocalUser(token);
        setUser(data);
      } catch {
        localStorage.removeItem("store-auth-token");
        setToken(null);
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrapAuth();
  }, [token]);

  const login = async (credentials) => {
    const data = await loginLocalUser(credentials);
    localStorage.setItem("store-auth-token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const data = await registerLocalUser(payload);
    localStorage.setItem("store-auth-token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await logoutLocalUser(token);
    } catch {
      // no-op logout cleanup still happens locally
    }
    localStorage.removeItem("store-auth-token");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isBootstrapping,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    }),
    [token, user, isBootstrapping],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
