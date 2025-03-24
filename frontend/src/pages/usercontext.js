import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: localStorage.getItem("name") || "", // Initialize with stored name
    token: localStorage.getItem("token") || "", // Initialize with stored token
  });

  const login = (name, token) => {
    setUser({ name, token }); // Update the user state
    localStorage.setItem("name", name); // Store name in localStorage
    localStorage.setItem("token", token); // Store token in localStorage
  };

  const logout = () => {
    setUser({ name: "", token: "" }); // Clear the user state
    localStorage.clear(); // Clear all stored data
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};