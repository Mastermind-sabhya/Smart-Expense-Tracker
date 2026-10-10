import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './Dashboard.css';

function Dashboard() {
  const token = localStorage.getItem('token');
  
  // Income State
  const [incSource, setIncSource] = useState('Salary');
  const [incAmount, setIncAmount] = useState('');
  const [incDate, setIncDate] = useState('');

  // Expense State
  const [expCategory, setExpCategory] = useState('Food');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState('');

  // UI Results
  const [savingResult, setSavingResult] = useState('');
  const [goalResult, setGoalResult] = useState('');

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:5001',
    headers: { Authorization: `Bearer ${token}` }
  });

  const addTransaction = async (type, sourceOrCategory, amount, date) => {
    if (!amount || !date) return alert('Please enter amount and date');
    try {
      await axiosInstance.post('/api/transactions', { 
        type, sourceOrCategory, amount: Number(amount), date 
      });
      alert(`${type} added successfully!`);
      if(type==='income'){
        setIncAmount(''); setIncDate('');
      } else {
        setExpAmount(''); setExpDate('');
      }
    } catch(err) {
      alert('Error adding transaction');
      console.error(err);
    }
  };

  const calculateSavings = () => {
    const saving = Number(document.getElementById("monthlySaving").value);
    const type = document.getElementById("savingType").value;
    let yearly = 0;
    if (type === "day") yearly = saving * 365;
    else if (type === "month") yearly = saving * 12;
    else yearly = saving;
    setSavingResult(`Your yearly savings will be ₹ ${yearly}`);
  };

  const calculateGoal = async () => {
    const target = Number(document.getElementById("goalAmount").value);
    const saving = Number(document.getElementById("goalSaving").value);
    const type = document.getElementById("goalType").value;
    const cat = document.getElementById("goalCategory").value;

    let days = 0;
    if (type === "month") days = (target / saving) * 30;
    else if (type === "year") days = (target / saving) * 365;
    else days = target / saving;
    setGoalResult(`You will reach your goal in ${Math.ceil(days)} days`);

    // Save goal back to backend
    try {
      await axiosInstance.post('/api/goals', {
        category: cat,
        targetAmount: target,
        savingPerPeriod: saving,
        periodType: type
      });
    } catch (e) {
      console.error("Failed to save goal", e);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      
      <Navbar title="Smart Expense Tracker" />

      <div className="main-layout">
        <div className="side-image">
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135706.png" alt="Tracker" />
          <h3>Track Your Money Smartly</h3>
          <p>Plan savings and manage your expenses easily.</p>
        </div>

        <div className="container">
          
          <div className="card">
            <h3>Add Income</h3>
            <select value={incSource} onChange={e => setIncSource(e.target.value)}>
              <option>Salary</option>
              <option>Pocket Money</option>
              <option>Freelancing</option>
              <option>Business</option>
              <option>Gift</option>
              <option>Other</option>
            </select>
            <input type="number" placeholder="Enter Amount" value={incAmount} onChange={e => setIncAmount(e.target.value)} />
            <input type="date" value={incDate} onChange={e => setIncDate(e.target.value)} />
            <button onClick={() => addTransaction('income', incSource, incAmount, incDate)}>Add Income</button>
          </div>

          <div className="card">
            <h3>Add Expense</h3>
            <select value={expCategory} onChange={e => setExpCategory(e.target.value)}>
              <option>Food</option>
              <option>Travel</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Education</option>
              <option>Entertainment</option>
            </select>
            <input type="number" placeholder="Enter Amount" value={expAmount} onChange={e => setExpAmount(e.target.value)} />
            <input type="date" value={expDate} onChange={e => setExpDate(e.target.value)} />
            <button onClick={() => addTransaction('expense', expCategory, expAmount, expDate)}>Add Expense</button>
          </div>

          <div className="card">
            <h3>Savings Calculator</h3>
            <select id="savingType">
              <option value="day">Saving Per Day</option>
              <option value="month">Saving Per Month</option>
              <option value="year">Saving Per Year</option>
            </select>
            <input type="number" id="monthlySaving" placeholder="Enter Saving Amount" />
            <button onClick={calculateSavings}>Calculate</button>
            <p className="result-text">{savingResult}</p>
          </div>

          <div className="card">
            <h3>Goal Planner</h3>
            <select id="goalCategory">
              <option>Electronics</option>
              <option>Travel</option>
              <option>Food</option>
              <option>Shopping</option>
              <option>Education</option>
              <option>Emergency Fund</option>
              <option>Car / Bike</option>
              <option>House</option>
            </select>
            <input type="number" id="goalAmount" placeholder="Target Amount" />
            <input type="number" id="goalSaving" placeholder="Saving Amount" />
            <select id="goalType">
              <option value="day">Saving Per Day</option>
              <option value="month">Saving Per Month</option>
              <option value="year">Saving Per Year</option>
            </select>
            <button onClick={calculateGoal}>Calculate Target</button>
            <p className="result-text">{goalResult}</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
