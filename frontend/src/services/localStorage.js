// localStorage utilities for authentication and data storage

const STORAGE_KEYS = {
  USERS: 'parth_ai_users',
  CURRENT_USER: 'parth_ai_current_user',
  CHATS: 'parth_ai_chats',
  TOKEN: 'parth_ai_token'
};

// Initialize default demo account
const initializeDefaultUser = () => {
  const users = getUsers();
  if (!users || users.length === 0) {
    const defaultUser = {
      id: 'default-admin-001',
      username: 'admin',
      email: 'admin@parthai.com',
      password: 'admin123', // In production, this should be hashed
      avatar: null,
      preferences: {
        theme: 'dark',
        language: 'english',
        model: 'openai/gpt-oss-120b:free'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([defaultUser]));
  }
};

// User management
const getUsers = () => {
  try {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

const saveUser = (user) => {
  try {
    const users = getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id || u.email === user.email);
    
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...user, updatedAt: new Date().toISOString() };
    } else {
      users.push({ ...user, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
};

const getUserByEmail = (email) => {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

const getUserById = (id) => {
  const users = getUsers();
  return users.find(u => u.id === id);
};

const deleteUser = (id) => {
  try {
    const users = getUsers();
    const filteredUsers = users.filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers));
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
};

// Current user session
const setCurrentUser = (user) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error setting current user:', error);
    return false;
  }
};

const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

const clearCurrentUser = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    return true;
  } catch (error) {
    console.error('Error clearing current user:', error);
    return false;
  }
};

// Token management
const setToken = (token) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    return true;
  } catch (error) {
    console.error('Error setting token:', error);
    return false;
  }
};

const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

// Chat management
const getChats = (userId) => {
  try {
    const chats = localStorage.getItem(STORAGE_KEYS.CHATS);
    const allChats = chats ? JSON.parse(chats) : [];
    return allChats.filter(chat => chat.userId === userId);
  } catch (error) {
    console.error('Error getting chats:', error);
    return [];
  }
};

const saveChat = (chat) => {
  try {
    const chats = localStorage.getItem(STORAGE_KEYS.CHATS);
    const allChats = chats ? JSON.parse(chats) : [];
    const existingIndex = allChats.findIndex(c => c.id === chat.id);
    
    if (existingIndex >= 0) {
      allChats[existingIndex] = { ...allChats[existingIndex], ...chat, updatedAt: new Date().toISOString() };
    } else {
      allChats.push({ ...chat, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(allChats));
    return true;
  } catch (error) {
    console.error('Error saving chat:', error);
    return false;
  }
};

const getChatById = (chatId, userId) => {
  const chats = getChats(userId);
  return chats.find(c => c.id === chatId);
};

const deleteChat = (chatId, userId) => {
  try {
    const chats = localStorage.getItem(STORAGE_KEYS.CHATS);
    const allChats = chats ? JSON.parse(chats) : [];
    const filteredChats = allChats.filter(c => c.id !== chatId);
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(filteredChats));
    return true;
  } catch (error) {
    console.error('Error deleting chat:', error);
    return false;
  }
};

// Initialize on load
initializeDefaultUser();

export {
  STORAGE_KEYS,
  getUsers,
  saveUser,
  getUserByEmail,
  getUserById,
  deleteUser,
  setCurrentUser,
  getCurrentUser,
  clearCurrentUser,
  setToken,
  getToken,
  getChats,
  saveChat,
  getChatById,
  deleteChat
};
