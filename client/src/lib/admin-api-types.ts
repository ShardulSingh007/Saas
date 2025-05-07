export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  number: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  currency: string;
  taxRate: number;
  invoicePrefix: string;
  invoiceNumberFormat: string;
}

export interface Profile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error';
  message: string;
  createdAt: string;
  read: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalInvoices: number;
  totalRevenue: number;
  pendingInvoices: number;
  recentNotifications: Notification[];
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: 'admin' | 'user';
}

export interface CreateInvoiceInput {
  customerName: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
}

export interface UpdateInvoiceInput {
  customerName?: string;
  amount?: number;
  status?: 'pending' | 'paid' | 'overdue';
  dueDate?: string;
}

export interface UpdatePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
} 