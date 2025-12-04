import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // while checking token on startup

  // TEST LOGIN CREDENTIALS (for development/testing only)
  // Email: test@example.com
  // Password: test123
  // This bypasses the backend API call when these credentials are used

  // Load current user on first load if token exists
  useEffect(() => {
    const token = localStorage.getItem("taskflow_token");
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await axiosClient.get("/auth/me");
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
    // Test login bypass
    if (email === "test@example.com" && password === "test123") {
      const testUser = {
        id: "test-user-1",
        name: "Test User",
        email: "test@example.com",
        role: "user",
      };
      setUser(testUser);
      localStorage.setItem("taskflow_token", "test-token-12345");
      return;
    }

    // Normal login flow
    const res = await axiosClient.post("/auth/login", { email, password });
    const { user, token } = res.data;
    setUser(user);
    if (token) {
      localStorage.setItem("taskflow_token", token);
    }
  };

  const signup = async (name, email, password) => {
    const res = await axiosClient.post("/auth/signup", {
      name,
      email,
      password,
    });
    const { user, token } = res.data;
    setUser(user);
    if (token) {
      localStorage.setItem("taskflow_token", token);
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (err) {
      console.warn("Logout request failed, clearing token anyway", err);
    }
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
