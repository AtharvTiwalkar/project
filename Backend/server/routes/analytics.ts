import express from 'express';
import Transaction from '../models/Transaction';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get advanced analytics
router.get('/advanced', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?._id;
    const { period = '12' } = req.query;
    
    const monthsBack = Number(period);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsBack);

    // Get monthly data for charts
    const monthlyData = await Transaction.aggregate([
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
    const categoryData = await Transaction.aggregate([
      { $match: { userId, type: 'expense', date: { $gte: startDate } } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 6 }
    ]);

    // Calculate totals
    const [totalIncome, totalExpenses] = await Promise.all([
      Transaction.aggregate([
        { $match: { userId, type: 'income', date: { $gte: startDate } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { userId, type: 'expense', date: { $gte: startDate } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const income = totalIncome[0]?.total || 0;
    const expenses = totalExpenses[0]?.total || 0;
    const savings = income - expenses;

    // Mock savings goals
    const savingsGoals = [
      { name: 'Emergency Fund', current: Math.max(0, savings * 0.4), target: 10000, color: 'bg-emerald-500' },
      { name: 'Vacation', current: Math.max(0, savings * 0.2), target: 5000, color: 'bg-blue-500' },
      { name: 'New Car', current: Math.max(0, savings * 0.3), target: 25000, color: 'bg-purple-500' },
      { name: 'Investment', current: Math.max(0, savings * 0.1), target: 8000, color: 'bg-orange-500' }
    ];

    // Generate insights
    type Insight = {
        title: string;
        description: string;
        type: string; // you could also use: 'warning' | 'success' | 'info' | etc.
        icon: string;
    };

    const insights: Insight[] = [];
    
    if (expenses > income * 0.8) {
      insights.push({
        title: 'High Spending Alert',
        description: `Your expenses are ${Math.round((expenses/income) * 100)}% of your income`,
        type: 'warning',
        icon: 'TrendingUp'
      });
    }

    if (savings > 0) {
      insights.push({
        title: 'Savings Progress',
        description: `You've saved $${savings.toFixed(2)} this period`,
        type: 'success',
        icon: 'TrendingUp'
      });
    }

    res.json({
      monthlyData,
      categoryData,
      savingsGoals,
      insights,
      summary: {
        totalIncome: income,
        totalExpenses: expenses,
        totalSavings: savings,
        savingsRate: income > 0 ? (savings / income) * 100 : 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

export default router;
