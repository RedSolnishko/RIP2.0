import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { isTokenExpired } from '../api/auth';
import './style/ManagerPage.css';

function ManagerPage() {
  const [entries, setEntries] = useState([]);
  const [websiteName, setWebsiteName] = useState('');
  const [websiteURL, setWebsiteURL] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    if (isTokenExpired()) {
      navigate('/auth');
      return;
    }
  
    if (socket) {
      socket.emit('get_password_entries');
  
      socket.on('password_entries_response', (data) => {
        setEntries(data.entries || []);
      });
  
      socket.on('create_password_response', (response) => {
        if (response.success) {
          console.log('Пароль успешно добавлен:', response.message);
        } else {
          console.error('Ошибка при добавлении пароля:', response.message);
        }
      });
  
      socket.on('update_password_response', (response) => {
        if (response.success) {
          console.log('Пароль успешно обновлен:', response.message);
        } else {
          console.error('Ошибка при обновлении пароля:', response.message);
        }
      });
  
      return () => {
        socket.off('password_entries_response');
        socket.off('create_password_response');
        socket.off('update_password_response');
      };
    }
  }, [navigate, socket]);

  const handleAddEntry = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken'); // Retrieve the token
    const newEntry = { 
      site_name: websiteName, 
      url: websiteURL, 
      password,
      token // Include the token in the emitted data
    };
    console.log('Отправка запроса на создание пароля:', newEntry);
    socket.emit('create_password', newEntry);
    setWebsiteName('');
    setWebsiteURL('');
    setPassword('');
  };

  const handleUpdateEntry = (entryId, newSiteName, newUrl, newPassword) => {
    const updatedEntry = {
      entry_id: entryId,
      new_site_name: newSiteName,
      new_url: newUrl,
      new_encrypted_password: newPassword,
    };
    socket.emit('update_password', updatedEntry);
  };

  return (
    <div className='manager-page'>
      <h1>Менеджер</h1>
      <p>ТекстТекстТекст</p>
      
      <form onSubmit={handleAddEntry}>
        <input
          type="text"
          placeholder="Название сайта"
          value={websiteName}
          onChange={(e) => setWebsiteName(e.target.value)}
          required
        />
        <input
          type="url"
          placeholder="Ссылка на сайт"
          value={websiteURL}
          onChange={(e) => setWebsiteURL(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Добавить</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Название сайта</th>
            <th>Ссылка на сайт</th>
            <th>Пароль</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.resource_name}</td>
              <td><a href={entry.url} target="_blank" rel="noopener noreferrer">{entry.url}</a></td>
              <td>{entry.encrypted_password}</td>
              <td>
                <button onClick={() => handleUpdateEntry(entry.id, 'New Site Name', 'New URL', 'New Password')}>
                  Изменить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManagerPage;