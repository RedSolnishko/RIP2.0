import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { isTokenExpired } from '../api/auth';
import EditModal from './EditModal';
import './style/ManagerPage.css';

function ManagerPage() {
  const [entries, setEntries] = useState([]);
  const [websiteName, setWebsiteName] = useState('');
  const [websiteURL, setWebsiteURL] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    if (isTokenExpired()) {
      navigate('/auth');
      return;
    }
  
    if (socket) {
      const token = localStorage.getItem('jwtToken');
  
      socket.emit('get_password_entries', { token });
  
      socket.on('password_entries_response', (data) => {
        setEntries(data.entries || []);
      });
  
      socket.on('create_password_response', (response) => {
        if (response.success) {
          console.log('Запись успешно добавлен:', response.message);
        } else {
          console.error('Ошибка при добавлении записи:', response.message);
        }
      });
  
      socket.on('update_password_response', (response) => {
        if (response.success) {
          console.log('Запись успешно обновленна:', response.message);
          setEntries((prevEntries) => 
            prevEntries.map(entry => 
              entry.id === response.entry_id ? { ...entry, resource_name: response.new_site_name, url: response.new_url, encrypted_password: response.new_encrypted_password } : entry
            )
          );
        } else {
          console.error('Ошибка при обновлении записи:', response.message);
        }
      });
  
      socket.on('delete_password_response', (response) => {
        if (response.success) {
          console.log('Запись успешно удалена:', response.message);
          setEntries((prevEntries) => prevEntries.filter(entry => entry.id !== response.entry_id));
        } else {
          console.error('Ошибка при удалении записи:', response.message);
        }
      });
  
      return () => {
        socket.off('password_entries_response');
        socket.off('create_password_response');
        socket.off('update_password_response');
        socket.off('delete_password_response');
      };
    }
  }, [navigate, socket]);

  const handleAddEntry = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken');
    const newEntry = { 
      site_name: websiteName, 
      url: websiteURL, 
      password,
      token
    };
    console.log('Отправка запроса на создание пароля:', newEntry);
    socket.emit('create_password', newEntry);
    setWebsiteName('');
    setWebsiteURL('');
    setPassword('');
  };

  const handleUpdateEntry = (entryId, newSiteName, newUrl, newPassword) => {
    const token = localStorage.getItem('jwtToken');
    const updatedEntry = {
      entry_id: entryId,
      new_site_name: newSiteName,
      new_url: newUrl,
      new_encrypted_password: newPassword,
      token
    };
    socket.emit('update_password', updatedEntry);
  };

  const handleDeleteEntry = (entryId) => {
    const token = localStorage.getItem('jwtToken');
    const entryToDelete = {
      entry_id: entryId,
      token
    };
    socket.emit('delete_password', entryToDelete);
  };

  const openEditModal = (entry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
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
            <th>Изменить</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.resource_name}</td>
              <td><a href={entry.url} target="_blank" rel="noopener noreferrer">{entry.url}</a></td>
              <td>{entry.encrypted_password}</td>
              <td>
                <button onClick={() => openEditModal(entry)}>
                  Изменить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEntry && (
        <EditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          entry={selectedEntry}
          onSave={handleUpdateEntry}
          onDelete={handleDeleteEntry}
        />
      )}
    </div>
  );
}

export default ManagerPage;