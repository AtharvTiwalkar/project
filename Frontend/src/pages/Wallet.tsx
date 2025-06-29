import  { useState, useEffect } from 'react';
import { CreditCard, Plus, Send, ArrowUpRight, ArrowDownLeft, Eye, EyeOff, Wallet as WalletIcon } from 'lucide-react';
import { walletApi } from '../services/api';

interface WalletData {
  totalBalance: number;
  cards: Array<{
    id: number;
    type: string;
    number: string;
    balance: number;
    color: string;
  }>;
  recentActivity: Array<{
    _id: string;
    type: 'income' | 'expense';
    amount: number;
    recipient?: string;
    description: string;
    date: string;
    status: string;
  }>;
}

const Wallet = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await walletApi.getOverview();
        setWalletData(response.data);
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const quickActions = [
    { icon: Send, label: 'Send Money', color: 'bg-emerald-500' },
    { icon: ArrowDownLeft, label: 'Request', color: 'bg-blue-500' },
    { icon: Plus, label: 'Add Card', color: 'bg-purple-500' },
    { icon: ArrowUpRight, label: 'Pay Bills', color: 'bg-orange-500' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!walletData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load wallet data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Wallet</h1>
        <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Card</span>
        </button>
      </div>

      {/* Total Balance */}
      <div className="bg-gray-800 text-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <WalletIcon className="text-emerald-500" size={24} />
            <h2 className="text-lg font-semibold">Total Balance</h2>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className="text-3xl font-bold">
          {showBalance ? `$${walletData.totalBalance.toLocaleString()}` : '••••••••'}
        </div>
        <div className="text-sm text-gray-400 mt-1">
          Based on your transaction history
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {walletData.cards.map((card) => (
          <div key={card.id} className={`${card.color} text-white p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm opacity-90">{card.type}</span>
              <CreditCard size={24} />
            </div>
            <div className="text-lg font-mono mb-4">{card.number}</div>
            <div className="text-2xl font-bold">
              {showBalance ? `$${card.balance.toLocaleString()}` : '••••••'}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 text-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center space-y-2 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <div className={`p-3 rounded-full ${action.color}`}>
                <action.icon size={20} />
              </div>
              <span className="text-sm">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 text-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <button className="text-emerald-500 hover:text-emerald-400 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {walletData.recentActivity.map((activity) => (
            <div key={activity._id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  activity.type === 'expense' ? 'bg-red-500' : 'bg-green-500'
                }`}>
                  {activity.type === 'expense' ? 
                    <ArrowUpRight size={16} /> : 
                    <ArrowDownLeft size={16} />
                  }
                </div>
                <div>
                  <div className="font-medium">{activity.recipient || activity.description}</div>
                  <div className="text-sm text-gray-400">{new Date(activity.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${
                  activity.type === 'expense' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {activity.type === 'expense' ? '-' : '+'}${activity.amount}
                </div>
                <div className={`text-xs ${
                  activity.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {activity.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wallet;