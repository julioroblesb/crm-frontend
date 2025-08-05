import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for a logged-in user in localStorage on initial load
    try {
      const storedUser = localStorage.getItem('crm_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('crm_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { authService } = await import('../services/authService');
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('crm_user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      return error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crm_user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
