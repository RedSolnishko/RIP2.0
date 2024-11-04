import React, { useState, useEffect } from 'react';
import './style/UserProfile.css';
import avatar from './assets/user.png';
import { updateUserData, getUserData } from '../api/auth'; // Импорт функции для получения данных пользователя

// Основной компонент профиля пользователя
function UserProfile({ setIsAuthenticated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAvatar, setUserAvatar] = useState(avatar);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setUsername(userData.username);
        setUserEmail(userData.email);
        setUserAvatar(userData.avatar || avatar);
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsAuthenticated(false);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        username,
        email: userEmail,
        password,
        avatar: userAvatar,
      };
  
      const response = await updateUserData(userData);
  
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