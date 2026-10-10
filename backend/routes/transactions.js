const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// Get all user transactions
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Add a new transaction
router.post('/', auth, async (req, res) => {
  const { type, sourceOrCategory, amount, date } = req.body;
  try {
    const newTransaction = new Transaction({
      user: req.user.id,
      type,
      sourceOrCategory,
      amount,
      date
    });
    const transaction = await newTransaction.save();
    res.json(transaction);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete a transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
