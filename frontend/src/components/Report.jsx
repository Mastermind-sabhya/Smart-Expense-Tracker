import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import './Report.css';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function Report() {
  const token = localStorage.getItem('token');
  const [transactions, setTransactions] = useState([]);
  const [filterCat, setFilterCat] = useState('All');
  
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:5001',
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    const fetchTrans = async () => {
      try {
        const res = await axiosInstance.get('/api/transactions');
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions", err);
      }
    };
    fetchTrans();
  }, [token]);

  const expenses = transactions.filter(t => t.type === 'expense');
  
  // Aggregate data for Pie Chart (Category Spending)
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.sourceOrCategory] = (acc[curr.sourceOrCategory] || 0) + curr.amount;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0', '#9966ff'],
      borderWidth: 1
    }]
  };

  // Group by month for Bar & Line Charts
  const monthlyTotals = expenses.reduce((acc, curr) => {
    const month = new Date(curr.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + curr.amount;
    return acc;
  }, {});

  const barLineData = {
    labels: Object.keys(monthlyTotals),
    datasets: [{
      label: 'Monthly Expenses',
      data: Object.values(monthlyTotals),
      backgroundColor: '#4a6cf7',
      borderColor: '#7c3aed',
      fill: false,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#fff' }
      }
    },
    scales: {
      x: { ticks: { color: '#fff' } },
      y: { ticks: { color: '#fff' } }
    }
  };

  return (
    <div className="report-page">
      <Navbar title="Expense Analytics Dashboard" />

      <div className="container">
        
        <div className="card">
          <h3>Expense Filtering</h3>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Education">Education</option>
          </select>
          <button>Filter (WIP)</button>
        </div>

        <div className="chart-grid">
          <div className="chart-card" style={{ height: '350px' }}>
            <h3>Category Spending</h3>
            <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: '#fff' } } } }} />
          </div>

          <div className="chart-card" style={{ height: '350px' }}>
            <h3>Monthly Expenses</h3>
            <Bar data={barLineData} options={chartOptions} />
          </div>

          <div className="chart-card" style={{ height: '350px' }}>
            <h3>Spending Trend</h3>
            <Line data={barLineData} options={chartOptions} />
          </div>
        </div>

        <div className="card insights-card">
          <h3>Smart Insights</h3>
          <div id="insightsBox">
            <p>Your highest spending category is: {
              Object.keys(categoryTotals).length 
                ? Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b) 
                : "None"
            }</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Report;
