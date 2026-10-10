const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Goal = require('../models/Goal');

router.get('/', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
    res.json(goals);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/', auth, async (req, res) => {
  const { category, targetAmount, savingPerPeriod, periodType } = req.body;
  try {
    const newGoal = new Goal({
      user: req.user.id,
      category,
      targetAmount,
      savingPerPeriod,
      periodType
    });
    const goal = await newGoal.save();
    res.json(goal);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    let goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    if (goal.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
    
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Goal removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
