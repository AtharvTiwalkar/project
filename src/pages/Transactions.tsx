import React, { useEffect, useState } from 'react';
import { Download, Plus } from 'lucide-react';
import TransactionTable from '../components/Transactions/TransactionTable';
import TransactionFilters from '../components/Transactions/TransactionFilters';
import ExportModal from '../components/Export/ExportModal';
import { useTransactionStore } from '../stores/transactionStore';
import { dashboardApi } from '../services/api';

const Transactions = () => {
  const {
    transactions,
    pagination,
    filters,
    sortBy,
    sortOrder,
    isLoading,
    fetchTransactions,
    setFilters,
    setSorting
  } = useTransactionStore();

  const [categories, setCategories] = useState<string[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
    
    // Fetch categories for filter
    const fetchCategories = async () => {
      try {
        const response = await dashboardApi.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  const handleSort = (field: string) => {
    const newOrder = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc';
    setSorting(field, newOrder);
  };

  const handlePageChange = (page: number) => {
    fetchTransactions(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Export</span>
          </button>
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2">
            <Plus size={20} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      <TransactionFilters
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <>
          <TransactionTable
            transactions={transactions}
            onSort={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between bg-gray-800 px-6 py-4 rounded-xl">
              <div className="text-sm text-gray-400">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded ${
                      pagination.page === i + 1
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        filters={filters}
      />
    </div>
  );
};

export default Transactions;