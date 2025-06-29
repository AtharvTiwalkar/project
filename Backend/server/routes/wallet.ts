import express from 'express';
import Transaction from '../models/Transaction';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get wallet overview
router.get('/overview', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?._id;
    
    // Get total balance (income - expenses)
    const [totalIncome, totalExpenses] = await Promise.all([
      Transaction.aggregate([
        { $match: { userId, type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { userId, type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const income = totalIncome[0]?.total || 0;
    const expenses = totalExpenses[0]?.total || 0;
    const balance = income - expenses;

    // Get recent activity
    const recentActivity = await Transaction.find({ userId })
      .sort({ date: -1 })
      .limit(10)
      .select('type amount recipient description date status')
      .exec();

    // Mock cards data
    const cards = [
      {
        id: 1,
        type: 'Primary',
        number: '**** **** **** 4532',
        balance: balance * 0.6,
        color: 'bg-gradient-to-r from-emerald-500 to-emerald-600'
      },
      {
        id: 2,
        type: 'Savings',
        number: '**** **** **** 8901',
        balance: balance * 0.3,
        color: 'bg-gradient-to-r from-blue-500 to-blue-600'
      },
      {
        id: 3,
        type: 'Business',
        number: '**** **** **** 2345',
        balance: balance * 0.1,
        color: 'bg-gradient-to-r from-purple-500 to-purple-600'
      }
    ];

    res.json({
      totalBalance: balance,
      cards,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wallet data' });
  }
});

export default router;
