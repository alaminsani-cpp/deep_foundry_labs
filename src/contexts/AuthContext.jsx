import React, { createContext, useContext, useState, useEffect } from 'react';
import { firebaseService } from '../components/extra/fb.js';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Initialize auth
    firebaseService.init();

    // Subscribe to auth changes
    const unsubscribe = firebaseService.subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser && !currentUser.isAnonymous);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      await firebaseService.login(email, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await firebaseService.logout();
  };

  const value = {
    user,
    loading,
    isAdmin,
    login,
    logout,
    canWrite: firebaseService.canWrite
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};