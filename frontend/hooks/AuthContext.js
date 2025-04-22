import React, { createContext, useContext, useState } from "react";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component that provides the authentication state and functions
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to handle user login
  const login = (userData) => {
    setUser(userData);
    // Additional login logic (e.g., storing user data in localStorage)
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null);
    // Additional logout logic (e.g., removing user data from localStorage)
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};