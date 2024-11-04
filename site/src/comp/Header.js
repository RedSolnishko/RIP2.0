import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './style/Header.css';
import profileIcon from './assets/profile-icon.svg';
import home from "./assets/home.svg";

function Header({ isAuthenticated }) {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="header">
      <Link to="/">
        <img src={home} className="header-home" alt="home" />
      </Link>
      <Link to="/manager" className="header-manager-link">Менеджер</Link>
      <img
        src={profileIcon} className="profile-icon" alt="Profile Icon" onClick={handleProfileClick} />
    </header>
  );
}

export default Header;