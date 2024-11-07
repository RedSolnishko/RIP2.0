import React, { useState, useEffect } from 'react';
import './style/UserProfile.css';
import { getUserData, isTokenExpired } from '../api/auth'; // Импорт функции для проверки истечения токена
import axios from 'axios';

const API_URL = 'http://26.177.53.250';

function UserProfile({ setIsAuthenticated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const checkTokenAndFetchData = async () => {
      if (isTokenExpired()) {
        handleLogout();
        return;
      }
      try {
        const userData = await getUserData();
        console.log('User data:', userData);
        setUsername(userData.username);
        setUserEmail(userData.email);
        setUserAvatar(userData.avatar || userData.defaultAvatar);
        console.log('Avatar URL:', userData.avatar || userData.defaultAvatar);
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error.message);
      }
    };

    checkTokenAndFetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('tokenExpiration');
    setIsAuthenticated(false);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', userEmail);
      formData.append('password', password);

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput.files[0]) {
        formData.append('avatar', fileInput.files[0]);
      }

      const response = await axios.put(`${API_URL}/api/profile`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response) {
        console.log('Данные пользователя успешно обновлены.');
        setIsEditing(false);
      } else {
        console.error('Ошибка при обновлении данных пользователя.');
      }
    } catch (error) {
      console.error('Ошибка при обновлении данных пользователя:', error.message);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="user-profile">
      <div className="profile-section">
        <div className="profile-info">
          <img src={userAvatar} alt="User Avatar" className="avatar" />
          <div className="user-details">
            {isEditing ? (
              <form onSubmit={handleSaveChanges}>
                <input
                  type="text"
                  placeholder="Имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
                <button type="submit">Сохранить</button>
                <button type="button" onClick={() => setIsEditing(false)}>Отмена</button>
              </form>
            ) : (
              <>
                <p>Имя: {username}</p>
                <p>Email: {userEmail}</p>
              </>
            )}
          </div>
        </div>
        <div className="profile-settings">
          {!isEditing && <button onClick={() => setIsEditing(true)}>Изменить данные</button>}
        </div>
        <button onClick={handleLogout}>Выйти</button>
      </div>
    </div>
  );

  

}

export default UserProfile;