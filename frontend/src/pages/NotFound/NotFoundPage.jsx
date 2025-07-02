import React from 'react';
import './NotFoundPage.css';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="notfound-container">
    <h1>404</h1>
    <h2>Página no encontrada</h2>
    <p>La página que buscas no existe o fue movida.</p>
    <Link to="/" className="notfound-link">Ir al inicio</Link>
  </div>
);

export default NotFoundPage; 