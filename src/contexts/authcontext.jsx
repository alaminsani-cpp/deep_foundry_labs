import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Admin credentials from environment variables
  const adminCredentials = [
    {
      email: import.meta.env.VITE_ADMIN_EMAIL_1,
      name: import.meta.env.VITE_ADMIN_NAME_1,
      password: import.meta.env.VITE_ADMIN_PASSWORD_1
    },
    {
      email: import.meta.env.VITE_ADMIN_EMAIL_2,
      name: import.meta.env.VITE_ADMIN_NAME_2,
      password: import.meta.env.VITE_ADMIN_PASSWORD_2
    },
    {
      email: import.meta.env.VITE_ADMIN_EMAIL_3,
      name: import.meta.env.VITE_ADMIN_NAME_3,
      password: import.meta.env.VITE_ADMIN_PASSWORD_3
    }
  ];

  // Admin image mapping
  const adminImages = {
    [import.meta.env.VITE_ADMIN_EMAIL_1]: '/assets/admin1.jpg',
    [import.meta.env.VITE_ADMIN_EMAIL_2]: '/assets/admin2.jpg',
    [import.meta.env.VITE_ADMIN_EMAIL_3]: '/assets/admin3.jpg'
  };

  useEffect(() => {
    // Check if admin is already logged in
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession);
        // Get the admin info to include name and photo
        const admin = adminCredentials.find(cred => cred.email === session.email);
        if (admin) {
          const updatedSession = {
            ...session,
            name: admin.name,
            profilePicture: adminImages[session.email] || '/assets/admin.jpg'
          };
          setUser(updatedSession);
        } else {
          setUser(session);
        }
      } catch (err) {
        localStorage.removeItem('admin_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Find matching admin
    const admin = adminCredentials.find(
      cred => cred.email === email && cred.password === password
    );

    if (admin) {
      const session = {
        email: admin.email,
        name: admin.name,
        isAdmin: true,
        profilePicture: adminImages[admin.email] || '/assets/admin.jpg'
      };
      
      localStorage.setItem('admin_session', JSON.stringify(session));
      setUser(session);
      return { success: true };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    localStorage.removeItem('admin_session');
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAdmin: user?.isAdmin || false,
    adminName: user?.name || '',
    adminEmail: user?.email || '',
    adminPhoto: user?.profilePicture || '/assets/admin.jpg',
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};