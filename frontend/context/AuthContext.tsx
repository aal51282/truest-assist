// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as cookie from 'cookie';

// Define the types for the authentication context
interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user: { id: string; username: string } | null; // User details
  setUser: (user: { id: string; username: string } | null) => void;
  logout: () => void;
}

// Create the AuthContext with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to provide auth context to the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);

  // Load the auth state from cookies when the component mounts
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const cookies = cookie.parse(document.cookie || '');
        setIsLoggedIn(!!cookies.token); // Set logged-in state based on token presence

        if (cookies.token) {
          // If token exists, also load user details from localStorage (or other methods)
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (err) {
        console.error('Error parsing cookies:', err);
        setIsLoggedIn(false);
      }
    };

    loadAuthState();
  }, []);

  // Logout function to clear cookies and reset auth state
  const logout = () => {
    document.cookie = 'token=; Max-Age=0; path=/;'; // Clear token cookie
    setIsLoggedIn(false); // Reset logged-in state
    setUser(null); // Clear user data
    if (typeof window !== 'undefined') {
      window.location.href = '/'; // Redirect to home page
    }
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