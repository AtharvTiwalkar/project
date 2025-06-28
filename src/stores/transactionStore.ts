import { create } from 'zustand';
import { Transaction, TransactionFilters, PaginationInfo } from '../types';
import { transactionApi } from '../services/api';

interface TransactionState {
  transactions: Transaction[];
  pagination: PaginationInfo | null;
  filters: TransactionFilters;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  isLoading: boolean;
  error: string | null;
  
  fetchTransactions: (page?: number) => Promise<void>;
  setFilters: (filters: TransactionFilters) => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  clearError: () => void;
  addTransaction: (transaction: Omit<Transaction, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  pagination: null,
  filters: {},
  sortBy: 'date',
  sortOrder: 'desc',
  isLoading: false,
  error: null,

  fetchTransactions: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const { filters, sortBy, sortOrder } = get();
      const response = await transactionApi.getTransactions({
        page,
        limit: 10,
        ...filters,
        sortBy,
        sortOrder
      });
      
      set({
        transactions: response.data.transactions,
        pagination: response.data.pagination,
        isLoading: false
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch transactions',
        isLoading: false
      });
    }
  },

  setFilters: (filters: TransactionFilters) => {
    set({ filters });
    get().fetchTransactions(1);
  },

  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => {
    set({ sortBy, sortOrder });
    get().fetchTransactions(1);
  },

  clearError: () => {
    set({ error: null });
  },

  addTransaction: async (transactionData) => {
    try {
      await transactionApi.createTransaction(transactionData);
      get().fetchTransactions();
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to add transaction'
      });
      throw error;
    }
  },

  updateTransaction: async (id: string, updates: Partial<Transaction>) => {
    try {
      await transactionApi.updateTransaction(id, updates);
      get().fetchTransactions();
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to update transaction'
      });
      throw error;
    }
  },

  deleteTransaction: async (id: string) => {
    try {
      await transactionApi.deleteTransaction(id);
      get().fetchTransactions();
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to delete transaction'
      });
      throw error;
    }
  }
}));