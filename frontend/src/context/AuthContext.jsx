import { createContext, useContext, useMemo, useState } from "react";
import { TOKEN_STORAGE_KEY } from "../lib/api/client";
import { login as loginRequest, register as registerRequest } from "../lib/api/auth";

const USER_STORAGE_KEY = "cloudcart_user";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));

  function persist({ user: nextUser, token: nextToken }) {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
  }

  async function login(credentials) {
    const data = await loginRequest(credentials);
    persist(data);
    return data;
  }

  async function register(payload) {
    const data = await registerRequest(payload);
    persist(data);
    return data;
  }

  function updateUser(nextUser) {
    setUser(nextUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isAdmin: Boolean(user?.isAdmin),
      login,
      register,
      updateUser,
      logout
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
