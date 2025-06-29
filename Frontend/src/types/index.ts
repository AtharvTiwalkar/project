export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface Transaction {
  _id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  recipient?: string;
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardAnalytics {
  summary: {
    balance: number;
    income: number;
    expenses: number;
    savings: number;
  };
  monthlyTrends: Array<{
    _id: {
      year: number;
      month: number;
      type: 'income' | 'expense';
    };
    total: number;
  }>;
  categoryBreakdown: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
  recentTransactions: Transaction[];
}

export interface TransactionFilters {
  search?: string;
  category?: string;
  type?: 'income' | 'expense' | '';
  status?: 'completed' | 'pending' | 'failed' | '';
  startDate?: string;
  endDate?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ExportConfig {
  columns: string[];
  filters: TransactionFilters;
}