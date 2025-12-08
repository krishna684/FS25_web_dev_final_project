import { createContext, useContext, useEffect, useState } from "react";
import authApi from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // while checking token on startup

  // Load current user on first load if token exists
  useEffect(() => {
    const token = localStorage.getItem("taskflow_token");
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await authApi.getProfile();
        setUser(res.data.user || res.data);
      } catch (err) {
        console.error("Failed to load current user", err);
        localStorage.removeItem("taskflow_token");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    const { user, token } = res.data;
    setUser(user);
    if (token) {
      localStorage.setItem("taskflow_token", token);
    }
  };

  const signup = async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    const { user, token } = res.data;
    setUser(user);
    if (token) {
      localStorage.setItem("taskflow_token", token);
    }
  };

  const logout = async () => {
    // try {
    //   await authApi.logout(); 
    // } catch (err) { }
    // Backend logout usually not strictly required for JWT unless blacklist.
    // Given authApi doesn't have logout yet, we just clear client side.
    localStorage.removeItem("taskflow_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
