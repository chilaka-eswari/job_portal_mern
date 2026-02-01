import React from 'react';
import './auth-modal.css';

const AuthPromptModal = ({ visible, onClose, onLogin, onRegister }) => {
  if (!visible) return null;

  return (
    <div className="auth-modal-backdrop">
      <div className="auth-modal">
        <h3>Please log in to continue</h3>
        <p>You need to be logged in to apply for jobs or save them. Would you like to log in or register?</p>
        <div className="auth-modal-actions">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onLogin}>Login</button>
          <button className="btn btn-secondary" onClick={onRegister}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default AuthPromptModal;