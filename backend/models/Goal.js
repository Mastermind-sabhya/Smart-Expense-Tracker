const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  savingPerPeriod: {
    type: Number,
    required: true
  },
  periodType: {
    type: String,
    enum: ['day', 'month', 'year'],
    required: true
  }
});

module.exports = mongoose.model('Goal', goalSchema);
