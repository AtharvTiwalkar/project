import express from 'express';
import Transaction from '../models/Transaction';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get dashboard analytics
router.get('/analytics', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?._id;
    const { period = '12' } = req.query; // months
    
    const monthsBack = Number(period);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsBack);

    // Get summary metrics
    const [totalIncome, totalExpenses, recentTransactions] = await Promise.all([
      Transaction.aggregate([
        { $match: { userId, type: 'income', date: { $gte: startDate } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { userId, type: 'expense', date: { $gte: startDate } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.find({ userId })
        .sort({ date: -1 })
        .limit(5)
        .exec()
    ]);

    const income = totalIncome[0]?.total || 0;
    const expenses = totalExpenses[0]?.total || 0;
    const balance = income - expenses;
    const savings = balance > 0 ? balance : 0;

    // Get monthly trends
    const monthlyTrends = await Transaction.aggregate([
      { $match: { userId, date: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get category breakdown
    const categoryBreakdown = await Transaction.aggregate([
      { $match: { userId, type: 'expense', date: { $gte: startDate } } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      summary: {
        balance,
        income,
        expenses,
        savings
      },
      monthlyTrends,
      categoryBreakdown,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard analytics' });
  }
});

// Get transaction categories
router.get('/categories', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?._id;
    
    const categories = await Transaction.distinct('category', { userId });
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;