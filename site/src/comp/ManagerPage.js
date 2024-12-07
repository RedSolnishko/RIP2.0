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
      
      const fetchEntries = () => {
        socket.emit('get_password_entries', { token, include_passwords: true });
      };

      fetchEntries(); // Initial fetch

      const intervalId = setInterval(fetchEntries, 1000); // Fetch every second

      const handlePasswordEntriesResponse = (data) => {
        setEntries(data.entries || []);
      };

      socket.on('password_entries_response', handlePasswordEntriesResponse);

      return () => {
        clearInterval(intervalId);
        socket.off('password_entries_response', handlePasswordEntriesResponse);
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
      token,
    };
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
      token,
    };
    socket.emit('update_password', updatedEntry);
  };

  const handleDeleteEntry = (entryId) => {
    const token = localStorage.getItem('jwtToken');
    const entryToDelete = {
      entry_id: entryId,
      token,
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
              <td>
                <a href={entry.url} target="_blank" rel="noopener noreferrer">
                  {entry.url}
                </a>
              </td>
              <td>{entry.password}</td>
              <td>
                <button onClick={() => openEditModal(entry)}>Изменить</button>
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