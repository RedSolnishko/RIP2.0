import React from 'react';
import './style/EditModal.css';

function EditModal({ isOpen, onClose, entry, onSave, onDelete }) {
  const [newSiteName, setNewSiteName] = React.useState(entry.resource_name || '');
  const [newUrl, setNewUrl] = React.useState(entry.url || '');
  const [newPassword, setNewPassword] = React.useState(entry.encrypted_password || '');

  const handleSave = () => {
    onSave(entry.id, newSiteName, newUrl, newPassword);
    onClose();
  };

  const handleDelete = () => {
    onDelete(entry.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2 className='h2_edit_modal'>Редактировать запись</h2>
        <input
          type="text"
          value={newSiteName}
          onChange={(e) => setNewSiteName(e.target.value)}
          placeholder="Название сайта"
        />
        <input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Ссылка на сайт"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Пароль"
        />
        <button onClick={handleSave}>Сохранить</button>
        <button className="button_edit_cancer" onClick={handleDelete}>Удалить запись</button>
      </div>
    </div>
  );
}

export default EditModal;