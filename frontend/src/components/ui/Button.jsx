import React from 'react';
import './Button.css';

const Button = ({ children, type = 'button', className = '', ...props }) => {
  return (
    <button type={type} className={`ui-button ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button; 