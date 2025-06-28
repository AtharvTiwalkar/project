import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, User } from 'lucide-react';
import { Transaction } from '../../types';
import { format } from 'date-fns';

interface TransactionTableProps {
  transactions: Transaction[];
  onSort: (field: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onSort,
  sortBy,
  sortOrder
}) => {
  const getSortIcon = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown size={16} className="text-gray-400" />;
    return sortOrder === 'asc' ? 
      <ArrowUp size={16} className="text-emerald-500" /> : 
      <ArrowDown size={16} className="text-emerald-500" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAmountColor = (type: string, amount: number) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <button
                  onClick={() => onSort('recipient')}
                  className="flex items-center space-x-1 hover:text-white transition-colors"
                >
                  <span>Name</span>
                  {getSortIcon('recipient')}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <button
                  onClick={() => onSort('date')}
                  className="flex items-center space-x-1 hover:text-white transition-colors"
                >
                  <span>Date</span>
                  {getSortIcon('date')}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <button
                  onClick={() => onSort('amount')}
                  className="flex items-center space-x-1 hover:text-white transition-colors"
                >
                  <span>Amount</span>
                  {getSortIcon('amount')}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <button
                  onClick={() => onSort('status')}
                  className="flex items-center space-x-1 hover:text-white transition-colors"
                >
                  <span>Status</span>
                  {getSortIcon('status')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {transactions.map((transaction) => (
              <tr key={transaction._id} className="hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-300" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {transaction.recipient || transaction.description}
                      </div>
                      <div className="text-sm text-gray-400">
                        {transaction.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {format(new Date(transaction.date), 'EEE d MMM yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${getAmountColor(transaction.type, transaction.amount)}`}>
                    {transaction.type === 'income' ? '+' : '-'}$
                    {transaction.amount.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;