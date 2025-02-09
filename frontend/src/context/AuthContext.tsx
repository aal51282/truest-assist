'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the types for the authentication context
interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user: { id: string; username: string } | null;
  setUser: (user: { id: string; username: string } | null) => void;
  logout: () => void;
}

// Create the AuthContext with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to provide auth context to the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);

  // Load the auth state from localStorage when the component mounts
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const token = document.cookie.includes('token=');
        setIsLoggedIn(token);

        if (token) {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (err) {
        console.error('Error loading auth state:', err);
        setIsLoggedIn(false);
      }
    };

    loadAuthState();
  }, []);

  // Logout function to clear cookies and reset auth state
  const logout = () => {
    document.cookie = 'token=; Max-Age=0; path=/;';
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 