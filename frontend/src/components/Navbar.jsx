import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ title }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="navbar">
      <h2>{title || 'Smart Expense Tracker'}</h2>
      <div className="nav-links">
        <a onClick={() => navigate('/dashboard')}>Dashboard</a>
        <a onClick={() => navigate('/report')}>Reports</a>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Navbar;
