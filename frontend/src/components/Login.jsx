import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(`http://localhost:5001${endpoint}`, { username, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      window.location.href = '/dashboard';
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="login-page">
      <div className="background-animation"></div>
      <div className="container">
        <h2>Smart Expense Tracker</h2>
        <p className="subtitle">{isLogin ? 'Login to manage your expenses' : 'Register to get started'}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <label>Username (Email or Phone)</label>
            <input 
              type="text" 
              placeholder="Enter username" 
              required 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          
          <div className="input-box">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="login-btn">{isLogin ? 'Login' : 'Register'}</button>
          
          <div className="extra">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <a onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Register Here' : 'Login Here'}
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
