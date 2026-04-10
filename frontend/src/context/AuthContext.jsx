// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { token, id, email: userEmail, name, roles } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      
      const userData = { id, email: userEmail, name, roles };
      setUser(userData);
      
      toast.success('Login successful! Redirecting...', { icon: '🎉', duration: 2000 });
      
      if (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_TECHNICIAN')) {
        return { success: true, redirect: '/admin' };
      } else {
        return { success: true, redirect: '/' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.message || 'Invalid credentials');
      return { success: false, error: error.response?.data || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      await axiosInstance.post('/auth/register', { name, email, password, roles: ['user'] });
      toast.success('Account created successfully! Please login.', { icon: '🎉', duration: 2200 });
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.response?.data || 'Registration failed');
      return { success: false, error: error.response?.data || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const hasRole = (role) => user?.roles?.includes(role) || false;
  const isAdmin = () => hasRole('ROLE_ADMIN');
  const isTechnician = () => hasRole('ROLE_TECHNICIAN');
  const isUser = () => hasRole('ROLE_USER');
  
  const getUserInitial = () => {
    if (!user?.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };

  const value = {
    user, loading, token, login, register, logout,
    hasRole, isAdmin, isTechnician, isUser, getUserInitial
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};