import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { Transaction, TransactionFilters, DashboardAnalytics, ExportConfig } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: { email: string; password: string; name: string }) =>
    api.post('/auth/register', userData),
  
  getCurrentUser: () =>
    api.get('/auth/me')
};

// Transaction API
export const transactionApi = {
  getTransactions: (params: TransactionFilters & { page?: number; limit?: number; sortBy?: string; sortOrder?: string }) =>
    api.get('/transactions', { params }),
  
  getTransaction: (id: string) =>
    api.get(`/transactions/${id}`),
  
  createTransaction: (transaction: Omit<Transaction, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
    api.post('/transactions', transaction),
  
  updateTransaction: (id: string, updates: Partial<Transaction>) =>
    api.put(`/transactions/${id}`, updates),
  
  deleteTransaction: (id: string) =>
    api.delete(`/transactions/${id}`)
};

// Dashboard API
export const dashboardApi = {
  getAnalytics: (period?: string): Promise<{ data: DashboardAnalytics }> =>
    api.get('/dashboard/analytics', { params: { period } }),
  
  getCategories: () =>
    api.get('/dashboard/categories')
};

// Export API
export const exportApi = {
  exportCSV: (config: ExportConfig) =>
    api.post('/export/csv', config, {
      responseType: 'blob'
    })
};