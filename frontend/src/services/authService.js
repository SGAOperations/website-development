import axios from 'axios';

const BASE_URL = 'http://localhost:5002/auth/login';

// authenticate users when they log in
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}`, { 
      email, 
      password 
    });
    
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};