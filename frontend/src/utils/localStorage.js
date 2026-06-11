// localStorage utilities for managing users, chats, and settings

const STORAGE_KEYS = {
  USERS: 'parth_ai_users',
  CHATS: 'parth_ai_chats',
  CURRENT_USER: 'parth_ai_current_user',
  TOKEN: 'parth_ai_token'
};

// Initialize default demo account
const initializeDefaultUser = () => {
  const users = getUsers();
  if (users.length === 0) {
    const defaultUser = {
      id: 'admin-user-id',
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
export const getUsers = () => {
  try {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error getting users from localStorage:', error);
    return [];
  }
};

export const saveUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};

export const getUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

export const getUserByUsername = (username) => {
  const users = getUsers();
  return users.find(user => user.username === username);
};

export const addUser = (user) => {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
};

export const updateUser = (userId, updates) => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
    saveUsers(users);
    return users[index];
  }
  return null;
};

// Chat management
export const getChats = () => {
  try {
    const chats = localStorage.getItem(STORAGE_KEYS.CHATS);
    return chats ? JSON.parse(chats) : [];
  } catch (error) {
    console.error('Error getting chats from localStorage:', error);
    return [];
  }
};

export const saveChats = (chats) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  } catch (error) {
    console.error('Error saving chats to localStorage:', error);
  }
};

export const getChatsByUserId = (userId) => {
  const chats = getChats();
  return chats.filter(chat => chat.user === userId);
};

export const getChatById = (chatId) => {
  const chats = getChats();
  return chats.find(chat => chat.id === chatId);
};

export const addChat = (chat) => {
  const chats = getChats();
  chats.push(chat);
  saveChats(chats);
};

export const updateChat = (chatId, updates) => {
  const chats = getChats();
  const index = chats.findIndex(chat => chat.id === chatId);
  if (index !== -1) {
    chats[index] = { ...chats[index], ...updates, updatedAt: new Date().toISOString() };
    saveChats(chats);
    return chats[index];
  }
  return null;
};

export const deleteChat = (chatId) => {
  const chats = getChats();
  const filteredChats = chats.filter(chat => chat.id !== chatId);
  saveChats(filteredChats);
};

// Current user management
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user from localStorage:', error);
    return null;
  }
};

export const setCurrentUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (error) {
    console.error('Error setting current user in localStorage:', error);
  }
};

// Token management
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  } catch (error) {
    console.error('Error setting token in localStorage:', error);
  }
};

// Initialize on load
initializeDefaultUser();
