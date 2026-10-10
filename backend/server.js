cd const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const goalRoutes = require('./routes/goals');

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Smart Expense Tracker API is running!');
});

// Database connection
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    
    // Check if mongod is likely unavailable or this is dev, let's just use memory server
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
    console.log('Using MongoDB Memory Server at', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Memory Server');
    
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

startServer();
