import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentStudent, setCurrentStudent, clearCurrentStudent, loginUserApi } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getCurrentStudent());

  const login = async (username, password) => {
    const data = await loginUserApi({ username, password });
    if (data.user) {
      setCurrentUser(data.user);
      setCurrentStudent(data.user);
    }
    return data;
  };

  const logout = () => {
    clearCurrentStudent();
    setCurrentUser(null);
  };

  const updateUser = (user) => {
    setCurrentUser(user);
    setCurrentStudent(user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
