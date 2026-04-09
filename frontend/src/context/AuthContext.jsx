import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("campusflow-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("campusflow-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("campusflow-user");
    }
  }, [user]);

  const login = (email, password) => {
    const savedUsers = JSON.parse(localStorage.getItem("campusflow-users")) || [];

    const foundUser = savedUsers.find(
      (item) => item.email === email && item.password === password
    );

    if (!foundUser) {
      return { success: false, message: "Invalid email or password." };
    }

    setUser(foundUser);
    return { success: true };
  };

  const register = (formData) => {
    const savedUsers = JSON.parse(localStorage.getItem("campusflow-users")) || [];

    const alreadyExists = savedUsers.find(
      (item) => item.email === formData.email
    );

    if (alreadyExists) {
      return { success: false, message: "Email already registered." };
    }

    const newUser = {
      id: Date.now(),
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role || "USER",
    };

    const updatedUsers = [...savedUsers, newUser];
    localStorage.setItem("campusflow-users", JSON.stringify(updatedUsers));

    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);