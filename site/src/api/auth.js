// src/api/auth.js
import axios from 'axios';

const API_URL = 'http://26.177.53.250';

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/register`, {
      username,
      email,
      password,
    });
    const { token, expiresIn } = response.data;
    const expirationTime = new Date().getTime() + expiresIn * 1000; 
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('tokenExpiration', expirationTime);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/login`, {
      username,
      password,
    });
    const { token, expiresIn } = response.data;
    const expirationTime = new Date().getTime() + expiresIn * 1000;
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('tokenExpiration', expirationTime);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const isTokenExpired = () => {
  const expirationTime = localStorage.getItem('tokenExpiration');
  return new Date().getTime() > expirationTime;
};

export const getUserData = async () => {
  if (isTokenExpired()) {
    throw new Error('Токен истек. Пожалуйста, войдите снова.');
  }
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await axios.get(`${API_URL}/api/user_info`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Не удалось получить данные пользователя.');
  }
};

export const updateUserData = async (userData) => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await axios.put(`${API_URL}/api/profile`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw new Error('Не удалось обновить данные пользователя.');
  }
};