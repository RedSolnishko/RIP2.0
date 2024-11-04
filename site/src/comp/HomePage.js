import React from 'react';
import './style/HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Добро пожаловать в наш Менеджер Паролей</h1>
        <p>Наш менеджер паролей - это лучший выбор для защиты ваших данных. Вот почему:</p>
      </header>
      <section className="features">
        <div className="feature">
          <h2>Безопасность</h2>
          <p>Мы используем самые современные методы шифрования для защиты ваших паролей.</p>
        </div>
        <div className="feature">
          <h2>Удобство</h2>
          <p>Наш интерфейс интуитивно понятен и прост в использовании.</p>
        </div>
        <div className="feature">
          <h2>Доступность</h2>
          <p>Вы можете получить доступ к своим паролям с любого устройства в любое время.</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;