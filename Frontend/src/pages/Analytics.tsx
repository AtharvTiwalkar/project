import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import {  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell,  Area, AreaChart, Pie } from 'recharts';
import { analyticsApi } from '../services/api';

interface AnalyticsData {
  monthlyData: any[];
  categoryData: any[];
  savingsGoals: any[];
  insights: any[];
  summary: {
    totalIncome: number;
    totalExpenses: number;
    totalSavings: number;
    savingsRate: number;
  };
}

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await analyticsApi.getAdvanced(selectedPeriod);
        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedPeriod]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load analytics data</p>
      </div>
    );
  }

  // Format monthly data for charts
  const chartData = analyticsData.monthlyData.reduce((acc, item) => {
    const monthKey = `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`;
    const existingEntry = acc.find((entry: any) => entry.month === monthKey);
    
    if (existingEntry) {
      existingEntry[item._id.type] = item.total;
    } else {
      acc.push({
        month: monthKey,
        income: item._id.type === 'income' ? item.total : 0,
        expenses: item._id.type === 'expense' ? item.total : 0,
        savings: 0
      });
    }
    
    return acc;
  }, []);

  // Calculate savings for each month
  chartData.forEach((entry: any) => {
    entry.savings = entry.income - entry.expenses;
  });

  // Format category data for pie chart
  const categoryChartData = analyticsData.categoryData.map((cat, index) => ({
    name: cat._id,
    value: cat.total,
    color: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'][index % 6]
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="3">Last 3 Months</option>
            <option value="6">Last 6 Months</option>
            <option value="12">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="text-emerald-500" size={24} />
            <span className="text-green-400 text-sm">
              {analyticsData.summary.savingsRate > 0 ? '+' : ''}{analyticsData.summary.savingsRate.toFixed(1)}%
            </span>
          </div>
          <div className="text-2xl font-bold">${analyticsData.summary.totalIncome.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Total Income</div>
        </div>
        <div className="bg-gray-800 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <TrendingDown className="text-red-500" size={24} />
            <span className="text-red-400 text-sm">Expenses</span>
          </div>
          <div className="text-2xl font-bold">${analyticsData.summary.totalExpenses.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Total Expenses</div>
        </div>
        <div className="bg-gray-800 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="text-blue-500" size={24} />
            <span className="text-green-400 text-sm">
              {analyticsData.summary.totalSavings > 0 ? '+' : ''}{analyticsData.summary.savingsRate.toFixed(1)}%
            </span>
          </div>
          <div className="text-2xl font-bold">${analyticsData.summary.totalSavings.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Total Savings</div>
        </div>
        <div className="bg-gray-800 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <PieChart className="text-purple-500" size={24} />
            <span className="text-green-400 text-sm">{analyticsData.summary.savingsRate.toFixed(1)}%</span>
          </div>
          <div className="text-2xl font-bold">{analyticsData.summary.savingsRate.toFixed(1)}%</div>
          <div className="text-gray-400 text-sm">Savings Rate</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-gray-800 text-white p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-6">Monthly Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="income" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="expenses" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-gray-800 text-white p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-6">Expense Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryChartData.map((category, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-sm text-gray-400">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Savings Goals */}
      <div className="bg-gray-800 text-white p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-6">Savings Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analyticsData.savingsGoals.map((goal, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{goal.name}</h4>
                <span className="text-sm text-gray-400">
                  ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full ${goal.color}`}
                  style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-400">
                {Math.round((goal.current / goal.target) * 100)}% complete
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gray-800 text-white p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-6">Financial Insights</h3>
        <div className="space-y-4">
          {analyticsData.insights.map((insight, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
              <div className={`p-2 rounded-full ${
                insight.type === 'success' ? 'bg-green-500' :
                insight.type === 'warning' ? 'bg-yellow-500' : 
                insight.type === 'info' ? 'bg-blue-500' : 'bg-red-500'
              }`}>
                {insight.icon === 'TrendingUp' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              </div>
              <div>
                <h4 className="font-medium">{insight.title}</h4>
                <p className="text-sm text-gray-400">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;