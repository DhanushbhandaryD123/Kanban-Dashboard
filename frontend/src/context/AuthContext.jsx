import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);
    api
      .get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
      window.location.replace("/login");
    };
    window.addEventListener("auth:logout", handleForceLogout);
    return () => window.removeEventListener("auth:logout", handleForceLogout);
  }, []);

  const authenticate = (path, payload) =>
    api.post(`/auth/${path}`, payload).then(({ data }) => {
      localStorage.setItem("token", data.token);
      setUser(data.user);
      return data.user;
    });

  const login = (payload) => authenticate("login", payload);
  const register = (payload) => authenticate("register", payload);
  const loginDemo = () => {
    setUser({ name: "Demo User", email: "demo@kanban.dev", role: "owner" });
  };
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
