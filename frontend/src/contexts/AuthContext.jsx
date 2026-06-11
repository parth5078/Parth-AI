import { createContext, useContext, useState, useEffect } from 'react';
import {
  getUserByEmail,
  saveUser,
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  setToken,
  getToken
} from '../services/localStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setTokenState] = useState(getToken());

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = getToken();
      const currentUser = getCurrentUser();
      
      if (storedToken && currentUser) {
        setUser(currentUser);
        setTokenState(storedToken);
      } else {
        clearCurrentUser();
        setTokenState(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const existingUser = getUserByEmail(email);
      
      if (!existingUser) {
        return { 
          success: false, 
          error: 'Invalid credentials' 
        };
      }

      if (existingUser.password !== password) {
        return { 
          success: false, 
          error: 'Invalid credentials' 
        };
      }

      const token = 'jwt_' + Date.now() + '_' + Math.random().toString(36).substr(2);
      setToken(token);
      setTokenState(token);
      
      const userWithoutPassword = { ...existingUser };
      delete userWithoutPassword.password;
      
      setCurrentUser(userWithoutPassword);
      setUser(userWithoutPassword);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: 'Login failed' 
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const existingUser = getUserByEmail(email);
      
      if (existingUser) {
        return { 
          success: false, 
          error: 'User already exists' 
        };
      }

      if (password.length < 6) {
        return { 
          success: false, 
          error: 'Password must be at least 6 characters' 
        };
      }

      const newUser = {
        id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2),
        username,
        email: email.toLowerCase(),
        password,
        avatar: null,
        preferences: {
          theme: 'dark',
          language: 'english',
          model: 'openai/gpt-oss-120b:free'
        }
      };

      saveUser(newUser);
      
      const token = 'jwt_' + Date.now() + '_' + Math.random().toString(36).substr(2);
      setToken(token);
      setTokenState(token);
      
      const userWithoutPassword = { ...newUser };
      delete userWithoutPassword.password;
      
      setCurrentUser(userWithoutPassword);
      setUser(userWithoutPassword);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: 'Registration failed' 
      };
    }
  };

  const logout = () => {
    clearCurrentUser();
    setTokenState(null);
    setUser(null);
  };

  const updateProfile = async (updates) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        return { 
          success: false, 
          error: 'Not authenticated' 
        };
      }

      const updatedUser = { ...currentUser, ...updates };
      
      // Include password for saveUser (it's stored separately)
      const users = JSON.parse(localStorage.getItem('parth_ai_users') || '[]');
      const userWithPassword = users.find(u => u.id === currentUser.id);
      
      if (userWithPassword) {
        const finalUser = { ...userWithPassword, ...updates };
        saveUser(finalUser);
        
        const userWithoutPassword = { ...finalUser };
        delete userWithoutPassword.password;
        
        setCurrentUser(userWithoutPassword);
        setUser(userWithoutPassword);
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: 'Update failed' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      token, 
      login, 
      register, 
      logout, 
      updateProfile 
    }}>
      {children}
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
