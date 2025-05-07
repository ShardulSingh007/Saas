import { useAuth } from '@/contexts/auth-context';
import { toast } from '@/components/ui/use-toast';

const API_BASE_URL = '/api/admin';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface Invoice {
  id: string;
  number: string;
  customerName: string;
  amount: number;
  status: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Settings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  currency: string;
  taxRate: number;
  invoicePrefix: string;
  invoiceNumberFormat: string;
}

class AdminApi {
  private baseUrl = '/api/admin';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const { token } = useAuth();

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred');
      }

      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  }

  // User Management
  getUsers(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/users');
  }

  getUser(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/users/${id}`);
  }

  createUser(userData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Invoice endpoints
  async getInvoices(): Promise<ApiResponse<Invoice[]>> {
    return this.request<Invoice[]>('/invoices');
  }

  async getInvoice(id: string): Promise<ApiResponse<Invoice>> {
    return this.request<Invoice>(`/invoices/${id}`);
  }

  async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Invoice>> {
    return this.request<Invoice>('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoice),
    });
  }

  async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<ApiResponse<Invoice>> {
    return this.request<Invoice>(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(invoice),
    });
  }

  async deleteInvoice(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/invoices/${id}`, {
      method: 'DELETE',
    });
  }

  // Settings endpoints
  async getSettings(): Promise<ApiResponse<Settings>> {
    return this.request<Settings>('/settings');
  }

  async updateSettings(settings: Settings): Promise<ApiResponse<Settings>> {
    return this.request<Settings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Profile
  getProfile(): Promise<ApiResponse<any>> {
    return this.request<any>('/profile');
  }

  updateProfile(profileData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Notifications
  getNotifications(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/notifications');
  }

  markNotificationAsRead(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    return this.request<void>('/notifications/read-all', {
      method: 'PUT',
    });
  }

  deleteNotification(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }
}

export const adminApi = new AdminApi(); 