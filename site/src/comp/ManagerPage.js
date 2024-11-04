import React, { useState } from 'react';
import './style/ManagerPage.css'

function ManagerPage() {
  const [entries, setEntries] = useState([]);
  const [websiteName, setWebsiteName] = useState('');
  const [websiteURL, setWebsiteURL] = useState('');
  const [password, setPassword] = useState('');

  const handleAddEntry = (e) => {
    e.preventDefault();
    const newEntry = { websiteName, websiteURL, password };
    setEntries([...entries, newEntry]);
    setWebsiteName('');
    setWebsiteURL('');
    setPassword('');
  };

  return (
    <div className='manager-page'>
      <h1>Менеджер</h1>
      <p>Чё пасёшь, гнида?!</p>
      
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
              <td>{entry.websiteName}</td>
              <td><a href={entry.websiteURL} target="_blank" rel="noopener noreferrer">{entry.websiteURL}</a></td>
              <td>{entry.password}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManagerPage;