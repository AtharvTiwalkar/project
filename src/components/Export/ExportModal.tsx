import React, { useState } from 'react';
import { X, Download, FileText } from 'lucide-react';
import { ExportConfig, TransactionFilters } from '../../types';
import { exportApi } from '../../services/api';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TransactionFilters;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, filters }) => {
  const [selectedColumns, setSelectedColumns] = useState([
    'date',
    'description',
    'amount',
    'type',
    'category',
    'status'
  ]);
  const [isExporting, setIsExporting] = useState(false);

  const availableColumns = [
    { id: 'date', label: 'Date' },
    { id: 'description', label: 'Description' },
    { id: 'amount', label: 'Amount' },
    { id: 'type', label: 'Type' },
    { id: 'category', label: 'Category' },
    { id: 'status', label: 'Status' },
    { id: 'recipient', label: 'Recipient' },
    { id: 'reference', label: 'Reference' }
  ];

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns(prev =>
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleExport = async () => {
    if (selectedColumns.length === 0) {
      alert('Please select at least one column to export');
      return;
    }

    setIsExporting(true);
    try {
      const config: ExportConfig = {
        columns: selectedColumns,
        filters
      };

      const response = await exportApi.exportCSV(config);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FileText className="text-emerald-500" size={24} />
            <h2 className="text-xl font-semibold">Export Transactions</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Select Columns to Export</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableColumns.map((column) => (
              <label key={column.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(column.id)}
                  onChange={() => handleColumnToggle(column.id)}
                  className="form-checkbox h-4 w-4 text-emerald-500 rounded focus:ring-emerald-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-300">{column.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Export Summary</h3>
          <div className="bg-gray-700 rounded-lg p-3 text-sm">
            <p className="text-gray-400">
              Selected columns: <span className="text-white">{selectedColumns.length}</span>
            </p>
            <p className="text-gray-400">
              Active filters: <span className="text-white">
                {Object.values(filters).filter(Boolean).length}
              </span>
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || selectedColumns.length === 0}
            className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;