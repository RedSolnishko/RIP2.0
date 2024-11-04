// src/api/auth.js
import axios from 'axios';

const API_URL = 'http://26.177.53.250';

export const register = async (username, email, password) => {
  try {
    console.log('Sending registration request...');
    const response = await axios.post(`${API_URL}/api/register`, {
      username,
      email,
      password,
    });
    console.log('Registration request sent successfully');
    const { token } = response.data;
    localStorage.setItem('jwtToken', token);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    console.log('Sending login request...');
    const response = await axios.post(`${API_URL}/api/login`, {
      username,
      password,
    });
    console.log('Login request sent successfully');
    const { token } = response.data;
    localStorage.setItem('jwtToken', token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (error.response && error.response.status === 401) {
      throw new Error('Неверное имя пользователя или пароль.');
    } else {
      throw new Error('Ошибка при авторизации. Попробуйте снова.');
    }
  }
};

export const getUserData = async () => {
  try {
    const token = localStorage.getItem('jwtToken'); // Получаем токен из localStorage
    console.log('Retrieved token:', token); // Выводим токен в консоль для проверки

    const response = await axios.get(`${API_URL}/api/user_info`, {
      headers: {
        Authorization: `Bearer ${token}` // Передаем токен в заголовке запроса
      }
    });
    return response.data; // Возвращаем данные пользователя
  } catch (error) {
    console.error('Error fetching user data:', error);
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