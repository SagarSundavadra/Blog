import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SubscribePage.css';

const SubscribePage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      alert('Please enter a valid email address.');
      return;
    }

    alert(`Subscribed with email: ${email}`);
    navigate('/', { replace: true });
  };

  return (
    <div className="subscribe-container">
      <h2 className="subscribe-title">Subscribe to Our Newsletter</h2>
      <form onSubmit={handleSubmit} className="subscribe-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="subscribe-input"
        />
        <button type="submit" className="subscribe-button">
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default SubscribePage;
