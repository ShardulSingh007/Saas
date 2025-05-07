export interface User {
  id: number;
  username: string;
  password: string;
  name: string | null;
  email: string | null;
  isAdmin: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
}

export interface Payment {
  id: string;
  title: string;
  amount: number;
  dueDate: Date;
  status: 'paid' | 'upcoming' | 'overdue';
  category: 'utilities' | 'subscriptions' | 'loans' | 'rent' | 'mortgage' | 'insurance' | 'credit-card' | 'investments' | 'education' | 'healthcare' | 'other';
  notes?: string;
  paymentLink?: string;
  recurring?: boolean;
  shared?: boolean;
  lateFee?: number;
  emotionalTone: 'gentle' | 'professional' | 'urgent';
  notificationSettings?: {
    email?: boolean;
    sms?: boolean;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface CashFlowPrediction {
  date: Date;
  income: number;
  expenses: number;
  balance: number;
  alerts?: string[];
}

export interface SavingRecommendation {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  implementationSteps: string[];
}
