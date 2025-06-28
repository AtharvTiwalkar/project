import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import MetricCard from '../components/Dashboard/MetricCard';
import ChartCard from '../components/Dashboard/ChartCard';
import TransactionTable from '../components/Transactions/TransactionTable';
import { dashboardApi } from '../services/api';
import { DashboardAnalytics } from '../types';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await dashboardApi.getAnalytics();
        setAnalytics(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  // Format chart data
  const chartData = analytics.monthlyTrends.reduce((acc, trend) => {
    const monthKey = `${trend._id.year}-${trend._id.month.toString().padStart(2, '0')}`;
    const existingEntry = acc.find(entry => entry.month === monthKey);
    
    if (existingEntry) {
      existingEntry[trend._id.type] = trend.total;
    } else {
      acc.push({
        month: monthKey,
        income: trend._id.type === 'income' ? trend.total : 0,
        expense: trend._id.type === 'expense' ? trend.total : 0
      });
    }
    
    return acc;
  }, [] as any[]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Balance"
          value={`$${analytics.summary.balance.toLocaleString()}`}
          icon={DollarSign}
          color="bg-emerald-500"
        />
        <MetricCard
          title="Revenue"
          value={`$${analytics.summary.income.toLocaleString()}`}
          icon={TrendingUp}
          color="bg-blue-500"
        />
        <MetricCard
          title="Expenses"
          value={`$${analytics.summary.expenses.toLocaleString()}`}
          icon={TrendingDown}
          color="bg-red-500"
        />
        <MetricCard
          title="Savings"
          value={`$${analytics.summary.savings.toLocaleString()}`}
          icon={Wallet}
          color="bg-green-500"
        />
      </div>

      {/* Chart */}
      <ChartCard
        title="Overview"
        data={chartData}
      />

      {/* Recent Transactions */}
      <div className="bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
          <button className="text-emerald-500 hover:text-emerald-400 text-sm font-medium">
            See all
          </button>
        </div>
        <TransactionTable
          transactions={analytics.recentTransactions}
          onSort={() => {}}
          sortBy="date"
          sortOrder="desc"
        />
      </div>
    </div>
  );
};

export default Dashboard;