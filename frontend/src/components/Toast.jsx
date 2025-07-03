import React from 'react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose }) => (
  <div className={`toast toast-${type}`}>
    {message}
    <button className="toast-close" onClick={onClose}>×</button>
  </div>
);

export default Toast;
