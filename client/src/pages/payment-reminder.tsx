import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { CurrencySelector } from '@/components/CurrencySelector';
import { PaymentReminderGuide } from '@/components/PaymentReminderGuide';
import {
  Bell,
  Calendar,
  Clock,
  PlusCircle,
  Search,
  Trash2,
  Edit2,
  Share2,
  DollarSign,
  BarChart2,
  Moon,
  Sun,
  Check,
  X,
  Users,
  Gift,
  Award,
  MessageCircle,
  AlertTriangle,
  ArrowRight,
  Wifi,
  WifiOff,
  ChevronRight,
  Settings,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from "@/hooks/use-auth";
import { toast } from '@/hooks/use-toast';
import { Achievement, Payment, CashFlowPrediction, SavingRecommendation } from '@shared/types';


// Helper functions (unchanged from original)
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const getDaysUntilDue = (dueDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getCategoryIcon = (category: Category) => {
  switch (category) {
    case 'utilities':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>;
    case 'subscriptions':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>;
    case 'loans':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M18 12h.01"/><path d="M6 12h.01"/></svg>;
    case 'rent':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case 'mortgage':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case 'insurance':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>;
    case 'credit-card':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>;
    case 'investments':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 12 5.6 5.6a1 1 0 0 0 1.4 0L16 10l4 4"/><path d="M22 6 12 6"/><path d="m18 2 4 4-4 4"/></svg>;
    case 'education':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
    case 'healthcare':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 19H5c-1 0-2-1-2-2V7c0-1 1-2 2-2h12c1 0 2 1 2 2v10c0 1-1 2-2 2h-3"/><path d="M8 19L12 15L16 19"/><rect x="9" y="7" width="6" height="2"/><rect x="9" y="11" width="6" height="2"/></svg>;
    default:
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
  }
};

const getCategoryColor = (category: Category): string => {
  switch (category) {
    case 'utilities':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'subscriptions':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'loans':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'rent':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'mortgage':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
    case 'insurance':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
    case 'credit-card':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'investments':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
    case 'education':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
    case 'healthcare':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getStatusColor = (status: Payment['status']): string => {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'overdue':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'paid':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getToneEmoji = (tone: Payment['emotionalTone']): string => {
  switch (tone) {
    case 'gentle':
      return '😊';
    case 'professional':
      return '🤝';
    case 'urgent':
      return '⚠️';
    default:
      return '📝';
  }
};

type Category =
  | 'utilities'
  | 'subscriptions'
  | 'loans'
  | 'rent'
  | 'mortgage'
  | 'insurance'
  | 'credit-card'
  | 'investments'
  | 'education'
  | 'healthcare'
  | 'other';


const PaymentReminderSystem: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [cashFlow, setCashFlow] = useState<CashFlowPrediction[]>([]);
  const [savingsRecommendations, setSavingsRecommendations] = useState<SavingRecommendation[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'overdue' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'amount' | 'title'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState<boolean>(false);
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState<boolean>(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState<boolean>(false);
  const [isSavingsDialogOpen, setIsSavingsDialogOpen] = useState<boolean>(false);
  const [isAchievementDialogOpen, setIsAchievementDialogOpen] = useState<boolean>(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);
  const [isGuideDialogOpen, setIsGuideDialogOpen] = useState<boolean>(false);
  const [currentSavingsTip, setCurrentSavingsTip] = useState<SavingRecommendation | null>(null);
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({
    title: '',
    amount: 0,
    dueDate: new Date(),
    category: 'other',
    recurring: false,
    notificationSettings: {
      email: true,
      sms: false,
      push: true,
      whatsapp: false,
      timing: [1, 3],
      sound: 'standard'
    },
    emotionalTone: 'professional',
    shared: false
  });
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [sharingPayment, setSharingPayment] = useState<Payment | null>(null);
  const [aiMessages, setAIMessages] = useState<{ id: string; text: string; isUser: boolean }[]>([
    { id: '1', text: "Hi there! I'm your Finance Buddy AI Assistant. How can I help with your payment reminders today?", isUser: false }
  ]);
  const [aiInput, setAiInput] = useState<string>('');
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Effects - using the improved localStorage handling from edited snippet
  useEffect(() => {
    try {
      const savedPayments = localStorage.getItem('paymentReminder_payments');
      const savedAchievements = localStorage.getItem('paymentReminder_achievements');
      const savedSavingsRecommendations = localStorage.getItem('paymentReminder_savings');

      if (savedPayments) {
        const parsedPayments: Payment[] = JSON.parse(savedPayments).map((payment: any) => ({
          ...payment,
          dueDate: new Date(payment.dueDate),
          createdAt: payment.createdAt ? new Date(payment.createdAt) : new Date()
        }));
        setPayments(parsedPayments);
      }

      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements));
      }

      if (savedSavingsRecommendations) {
        setSavingsRecommendations(JSON.parse(savedSavingsRecommendations));
      }

    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      setPayments([]);
      setAchievements([]);
      setSavingsRecommendations([]);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('paymentReminder_payments', JSON.stringify(payments));
    } catch (error) {
      console.error('Error saving payments to localStorage:', error);
    }
  }, [payments]);

  useEffect(() => {
    try {
      localStorage.setItem('paymentReminder_achievements', JSON.stringify(achievements));
    } catch (error) {
      console.error('Error saving achievements to localStorage:', error);
    }
  }, [achievements]);

  useEffect(() => {
    try {
      localStorage.setItem('paymentReminder_savings', JSON.stringify(savingsRecommendations));
    } catch (error) {
      console.error('Error saving savings recommendations to localStorage:', error);
    }
  }, [savingsRecommendations]);


  useEffect(() => {
    // Scroll to bottom of AI chat
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, isAiTyping]);

  // Check if a reminder is due soon (unchanged from original)
  useEffect(() => {
    const checkReminders = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcomingPayments = payments.filter(payment => {
        const dueDate = new Date(payment.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        const diffDays = getDaysUntilDue(dueDate);
        return payment.status === 'upcoming' && diffDays > 0 && diffDays <= 3;
      });

      if (upcomingPayments.length > 0) {
        const payment = upcomingPayments[0];
        const daysUntil = getDaysUntilDue(payment.dueDate);
        toast({
          title: `Payment Reminder ${getToneEmoji(payment.emotionalTone)}`,
          description: `${payment.title} is due in ${daysUntil} day${daysUntil > 1 ? 's' : ''}. Amount: ${formatCurrency(payment.amount)}`,
          duration: 5000,
        });
      }
    };

    // Check reminders when component mounts
    checkReminders();

    // Set up interval to check reminders every hour
    const interval = setInterval(checkReminders, 3600000);

    return () => clearInterval(interval);
  }, [payments]);

  // Detect online/offline status (unchanged from original)
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Show achievement when unlocked (unchanged from original)
  useEffect(() => {
    const unlockedAchievement = achievements.find(a => a.unlocked && !a.shown);
    if (unlockedAchievement) {
      toast({
        title: '🏆 Achievement Unlocked!',
        description: `${unlockedAchievement.title}: ${unlockedAchievement.description}`,
        duration: 5000,
      });

      setAchievements(prev =>
        prev.map(a =>
          a.id === unlockedAchievement.id ? { ...a, shown: true } : a
        )
      );
    }
  }, [achievements]);

  // Check for new achievements (unchanged from original)
  useEffect(() => {
    const paidOnTime = payments.filter(p => p.status === 'paid').length;
    const recurringPayments = payments.filter(p => p.recurring).length;
    const sharedPayments = payments.filter(p => p.shared).length;

    setAchievements(prev =>
      prev.map(a => {
        if (a.id === 'a4' && !a.unlocked) {
          return { ...a, progress: paidOnTime, unlocked: paidOnTime >= 10 };
        }
        return a;
      })
    );
  }, [payments]);

  // Handle send message to AI (unchanged from original)
  const handleAiSend = async () => {
    if (!aiInput.trim()) return;

    const userMessage = { id: Date.now().toString(), text: aiInput, isUser: true };
    setAIMessages(prev => [...prev, userMessage]);
    setAiInput('');
    setIsAiTyping(true);

    try {
      // Function to generate a response based on user input
      const generateResponse = async (input: string) => {
        // In a real app, this would call the Anthropic API
        // For now, we're simulating responses

        const lowercaseInput = input.toLowerCase();

        if (lowercaseInput.includes('overdue') || lowercaseInput.includes('late')) {
          const overduePayments = payments.filter(p => p.status === 'overdue');
          if (overduePayments.length > 0) {
            return `You have ${overduePayments.length} overdue payment${overduePayments.length > 1 ? 's' : ''}. The most urgent is "${overduePayments[0].title}" which was due on ${formatDate(overduePayments[0].dueDate)}. Would you like me to help you set up payment for this?`;
          } else {
            return "Good news! You don't have any overdue payments at the moment.";
          }
        }

        if (lowercaseInput.includes('upcoming') || lowercaseInput.includes('next')) {
          const upcomingPayments = payments.filter(p => p.status === 'upcoming').sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
          if (upcomingPayments.length > 0) {
            return `Your next payment is "${upcomingPayments[0].title}" for ${formatCurrency(upcomingPayments[0].amount)}, due on ${formatDate(upcomingPayments[0].dueDate)}. That's in ${getDaysUntilDue(upcomingPayments[0].dueDate)} days.`;
          } else {
            return "You don't have any upcoming payments scheduled. Would you like to add a new payment reminder?";
          }
        }

        if (lowercaseInput.includes('total') || lowercaseInput.includes('spend')) {
          const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
          return `Your total scheduled payments amount to ${formatCurrency(totalAmount)}. The largest payment is for ${formatCurrency(Math.max(...payments.map(p => p.amount)))}.`;
        }

        if (lowercaseInput.includes('save') || lowercaseInput.includes('saving')) {
          return `Based on your payment history, I've identified a few potential savings opportunities. For example, you might save ${formatCurrency(savingsRecommendations[0].potentialSavings)} ${savingsRecommendations[0].timePeriod} by ${savingsRecommendations[0].description.toLowerCase()}. Would you like more savings tips?`;
        }

        if (lowercaseInput.includes('add') || lowercaseInput.includes('new')) {
          setIsAddPaymentOpen(true);
          return "I've opened the form to add a new payment reminder for you. Just fill in the details and I'll help you keep track of it.";
        }

        // Default response
        return "I'm here to help you manage your payments and reminders. You can ask me about upcoming payments, overdue bills, how to save money, or I can help you add new payment reminders.";
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await generateResponse(aiInput);
      const aiResponse = { id: Date.now().toString(), text: response, isUser: false };
      setAIMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setAIMessages(prev => [
        ...prev,
        { id: Date.now().toString(), text: "Sorry, I encountered an error. Please try again later.", isUser: false }
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Handle filter change (unchanged from original)
  const handleFilterChange = (value: string) => {
    setFilter(value as 'all' | 'upcoming' | 'overdue' | 'paid');
  };

  // Handle sort change (unchanged from original)
  const handleSortChange = (value: string) => {
    if (value === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(value as 'dueDate' | 'amount' | 'title');
      setSortOrder('asc');
    }
  };

  // Filter and sort payments (unchanged from original)
  const filteredPayments = payments
    .filter(payment => {
      if (filter !== 'all' && payment.status !== filter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          payment.title.toLowerCase().includes(query) ||
          payment.category.toLowerCase().includes(query) ||
          (payment.notes && payment.notes.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return sortOrder === 'asc'
          ? a.dueDate.getTime() - b.dueDate.getTime()
          : b.dueDate.getTime() - a.dueDate.getTime();
      } else if (sortBy === 'amount') {
        return sortOrder === 'asc'
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
    });

  // Clear all payment reminder data (modified to remove dummy data reinitialization)
  const handleClearAllData = () => {
    if (confirm("Are you sure you want to clear all payment reminder data? This action cannot be undone.")) {
      setPayments([]);
      setAchievements([]);
      setSavingsRecommendations([]);

      try {
        localStorage.removeItem('paymentReminder_payments');
        localStorage.removeItem('paymentReminder_achievements');
        localStorage.removeItem('paymentReminder_savings');
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }

      toast({
        title: "All Data Cleared",
        description: "All your payment reminder data has been successfully cleared.",
      });
    }
  };

  // Payment handlers (unchanged from original)
  const handleAddPayment = () => {
    const id = Date.now().toString();
    const newPaymentData: Payment = {
      id,
      title: newPayment.title || 'Untitled Payment',
      amount: newPayment.amount || 0,
      dueDate: newPayment.dueDate || new Date(),
      category: newPayment.category || 'other',
      notes: newPayment.notes,
      recurring: newPayment.recurring || false,
      recurringPeriod: newPayment.recurringPeriod,
      paymentLink: newPayment.paymentLink,
      notificationSettings: newPayment.notificationSettings || {
        email: true,
        sms: false,
        push: true,
        whatsapp: false,
        timing: [1, 3],
        sound: 'standard'
      },
      emotionalTone: newPayment.emotionalTone || 'professional',
      shared: newPayment.shared || false,
      sharedWith: newPayment.sharedWith || [],
      status: 'upcoming',
      createdAt: new Date(),
      paymentMethod: newPayment.paymentMethod
    };

    setPayments(prev => [...prev, newPaymentData]);
    setNewPayment({
      title: '',
      amount: 0,
      dueDate: new Date(),
      category: 'other',
      recurring: false,
      notificationSettings: {
        email: true,
        sms: false,
        push: true,
        whatsapp: false,
        timing: [1, 3],
        sound: 'standard'
      },
      emotionalTone: 'professional',
      shared: false
    });
    setIsAddPaymentOpen(false);

    toast({
      title: '✅ Payment Reminder Added',
      description: `${newPaymentData.title} has been added to your reminders.`,
    });
  };

  const handleEditPayment = () => {
    if (!editingPayment) return;

    setPayments(prev =>
      prev.map(p =>
        p.id === editingPayment.id ? editingPayment : p
      )
    );

    setEditingPayment(null);
    setIsEditPaymentOpen(false);

    toast({
      title: '✅ Payment Reminder Updated',
      description: `${editingPayment.title} has been updated.`,
    });
  };

  const handleDeletePayment = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));

    toast({
      title: '🗑️ Payment Reminder Deleted',
      description: 'The payment reminder has been removed.',
    });
  };

  const handleMarkAsPaid = (id: string) => {
    const payment = payments.find(p => p.id === id);
    if (!payment) return;

    setPayments(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, status: 'paid' }
          : p
      )
    );

    const randomTip = savingsRecommendations[Math.floor(Math.random() * savingsRecommendations.length)];
    setCurrentSavingsTip(randomTip);
    setIsSavingsDialogOpen(true);

    toast({
      title: '💰 Payment Marked as Paid',
      description: `${payment.title} has been marked as paid.`,
    });

    const newAchievements = [...achievements];
    const onTimePayer = newAchievements.find(a => a.id === 'on-time-payer');
    if (onTimePayer && !onTimePayer.unlocked && !payment.status.includes('overdue')) {
      onTimePayer.progress = (onTimePayer.progress || 0) + 1;

      if (onTimePayer.progress >= (onTimePayer.maxProgress || 5)) {
        onTimePayer.unlocked = true;

        toast({
          title: '🏆 Achievement Unlocked!',
          description: 'On Time Payer: You\'ve paid 5 bills on time!',
          variant: 'default',
        });
      }

      setAchievements(newAchievements);
    }

    const unpaidRemaining = payments.filter(p => p.id !== id && p.status !== 'paid').length;
    if (unpaidRemaining === 0) {
      setTimeout(() => {
        toast({
          title: '🎉 All Caught Up!',
          description: 'You\'ve paid all your bills. Your finances are in great shape!',
          variant: 'default',
        });
      }, 1000);
    }
  };

  const handleSharePayment = () => {
    if (!sharingPayment) return;

    setPayments(prev =>
      prev.map(p =>
        p.id === sharingPayment.id
          ? { ...p, shared: true, sharedWith: sharingPayment.sharedWith }
          : p
      )
    );

    setSharingPayment(null);
    setIsShareDialogOpen(false);

    toast({
      title: '🔗 Payment Shared',
      description: `${sharingPayment.title} has been shared successfully.`,
    });
  };

  // Render payment card (unchanged from original)
  const renderPaymentCard = (payment: Payment) => {
    const daysUntil = getDaysUntilDue(payment.dueDate);
    const isOverdue = payment.status === 'overdue';
    const isPaid = payment.status === 'paid';

    return (
      <motion.div
        key={payment.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="group relative"
      >
        <Card className={`mb-4 overflow-hidden transition-all duration-300 hover:shadow-md ${
          isOverdue ? 'border-red-300 dark:border-red-800' :
            isPaid ? 'border-green-300 dark:border-green-800' :
            'border-blue-200 dark:border-blue-900'
        }`}>
          <div className={`absolute top-0 right-0 h-2 w-full ${
            isOverdue ? 'bg-red-500' :
              isPaid ? 'bg-green-500' :
                'bg-blue-500'
          }`} />
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${getCategoryColor(payment.category)}`}>
                  {getCategoryIcon(payment.category)}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{payment.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline" className={getStatusColor(payment.status)}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Badge>
                    <Badge variant="outline" className={getCategoryColor(payment.category)}>
                      {payment.category.charAt(0).toUpperCase() + payment.category.slice(1)}
                    </Badge>
                    {payment.recurring && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                        Recurring
                      </Badge>
                    )}
                    {payment.shared && (
                      <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                        Shared
                      </Badge>
                    )}
                  </div>
                  {payment.notes && (
                    <p className="text-sm text-muted-foreground mt-2">{payment.notes}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl">{formatCurrency(payment.amount)}</div>
                <div className="text-sm text-muted-foreground">Due {formatDate(payment.dueDate)}</div>
                {!isPaid && (
                  <div className={`text-sm mt-1 ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                    {isOverdue
                      ? `Overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? 's' : ''}`
                      : `${daysUntil} day${daysUntil !== 1 ? 's' : ''} until due`}
                  </div>
                )}
                {payment.lateFee && isOverdue && (
                  <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                    Late fee: {formatCurrency(payment.lateFee)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="mr-2">{getToneEmoji(payment.emotionalTone)}</span>
                <span>{payment.emotionalTone.charAt(0).toUpperCase() + payment.emotionalTone.slice(1)} reminder</span>
              </div>
              <div className="space-x-2">
                {!isPaid && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMarkAsPaid(payment.id)}
                    className="transition-all hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900 dark:hover:text-green-300"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark Paid
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      setEditingPayment(payment);
                      setIsEditPaymentOpen(true);
                    }}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSharingPayment(payment);
                      setIsShareDialogOpen(true);
                    }}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    {payment.paymentLink && (
                      <DropdownMenuItem
                        onClick={() => window.open(payment.paymentLink, '_blank')}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Pay Now
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 dark:text-red-400"
                      onClick={() => handleDeletePayment(payment.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gradient-to-r from-sky-400 to-blue-500 p-2 rounded-lg">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold">
                Payment Reminder System
                <span className="hidden sm:inline"> | Finance Buddy</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <CurrencySelector />
              <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Badge variant={isOnline ? "default" : "destructive"} className="hidden sm:flex">
                {isOnline ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                {isOnline ? "Online" : "Offline"}
              </Badge>
              <Button
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                onClick={() => setIsAddPaymentOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Reminder
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-blue-600">
            Stay Ahead, Stress-Free — Your Finance Buddy's Got You!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Never miss a payment again. Set up reminders, get smart notifications, and stay on top of your finances with AI assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Your Payment Reminders</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleClearAllData}
                      className="mr-2"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear All Data
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <BarChart2 className="h-4 w-4 mr-2" />
                          Sort By
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleSortChange('dueDate')}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Due Date {sortBy === 'dueDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSortChange('amount')}>
                          <DollarSign className="h-4 w-4 mr-2" />
                          Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSortChange('title')}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h12"/></svg>
                          Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search payments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Tabs defaultValue="all">
                  <TabsList className="grid grid-cols-4 mt-2">
                    <TabsTrigger value="all" onClick={() => handleFilterChange('all')}>All</TabsTrigger>
                    <TabsTrigger value="upcoming" onClick={() => handleFilterChange('upcoming')}>Upcoming</TabsTrigger>
                    <TabsTrigger value="overdue" onClick={() => handleFilterChange('overdue')}>Overdue</TabsTrigger>
                    <TabsTrigger value="paid" onClick={() => handleFilterChange('paid')}>Paid</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map(renderPaymentCard)
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="18" x="3" y="3" rx="2" />
                          <path d="M7 7h10" />
                          <path d="M7 12h10" />
                          <path d="M7 17h10" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium">No payments found</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {searchQuery
                          ? `No results for "${searchQuery}"`
                          : filter !== 'all'
                            ? `No ${filter} payments found`
                            : 'Add your first payment reminder'}
                      </p>
                      <Button
                        onClick={() => {
                          if (searchQuery) {
                            setSearchQuery('');
                          } else if (filter !== 'all') {
                            setFilter('all');
                          } else {
                            setIsAddPaymentOpen(true);
                          }
                        }}
                        className="mt-4"
                      >
                        {searchQuery
                          ? 'Clear search'
                          : filter !== 'all'
                            ? 'Show all payments'
                            : 'Add a payment reminder'}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Cash Flow Forecast */}
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Forecast</CardTitle>
                <CardDescription>
                  Projected cash flow based on your scheduled payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cashFlow.map((prediction, index) => {
                    const isToday = index === 0;
                    const hasChange = prediction.inflow > 0 || prediction.outflow > 0;

                    return (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-24 text-sm">
                          {isToday ? (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              Today
                            </Badge>
                          ) : (
                            formatDate(prediction.date)
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <div className="flex items-center">
                              {hasChange && (
                                <>
                                  {prediction.inflow > 0 && (
                                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 mr-2">
                                      +{formatCurrency(prediction.inflow)}
                                    </Badge>
                                  )}
                                  {prediction.outflow > 0 && (
                                    <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                      -{formatCurrency(prediction.outflow)}
                                    </Badge>
                                  )}
                                </>
                              )}
                            </div>
                            <div className="font-medium">
                              {formatCurrency(prediction.balance)}
                            </div>
                          </div>
                          <Progress
                            value={(prediction.balance / Math.max(...cashFlow.map(cf => cf.balance))) * 100}
                            className="h-2"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Move AI Assistant to the top of the sidebar */}
            <Card className="overflow-hidden border-blue-200 dark:border-blue-900">
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div className="text-white">
                    <h3 className="font-medium">Finance Buddy AI</h3>
                    <p className="text-sm text-sky-100">Your personal finance assistant</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <Button
                  onClick={() => setIsAIAssistantOpen(true)}
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat with Finance Buddy
                </Button>

                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsAddPaymentOpen(true)}>
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Payment
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setFilter('overdue')}>
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      View Overdue
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsAchievementDialogOpen(true)}>
                      <Award className="h-4 w-4 mr-1" />
                      Achievements
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsSavingsDialogOpen(true)}>
                      <Gift className="h-4 w-4 mr-1" />
                      Saving Tips
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Total Upcoming</div>
                    <div className="font-medium">
                      {formatCurrency(
                        payments
                          .filter(p => p.status === 'upcoming')
                          .reduce((sum, p) => sum + p.amount, 0)
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Total Overdue</div>
                    <div className="font-medium text-red-600 dark:text-red-400">
                      {formatCurrency(
                        payments
                          .filter(p => p.status === 'overdue')
                          .reduce((sum, p) => sum + p.amount, 0)
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Paid This Month</div>
                    <div className="font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(
                        payments
                          .filter(p =>
                            p.status === 'paid' &&
                            p.dueDate.getMonth() === new Date().getMonth() &&
                            p.dueDate.getFullYear() === new Date().getFullYear()
                          )
                          .reduce((sum, p) => sum + p.amount, 0)
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Next Due</div>
                    <div className="font-medium">
                      {(() => {
                        const upcoming = payments
                          .filter(p => p.status === 'upcoming')
                          .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

                        if (upcoming.length > 0) {
                          return formatDate(upcoming[0].dueDate);
                        }
                        return 'No upcoming payments';
                      })()}
                    </div>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Categories Breakdown</h4>
                    {(() => {
                      const categories: Record<Category, number> = {} as Record<Category, number>;

                      payments.forEach(p => {
                        if (!categories[p.category]) categories[p.category] = 0;
                        categories[p.category] += p.amount;
                      });

                      const totalAmount = Object.values(categories).reduce((sum, amount) => sum + amount, 0);

                      return Object.entries(categories)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 3)
                        .map(([category, amount]) => (
                          <div key={category} className="mb-2">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getCategoryColor(category as Category).includes('blue') ? '#93c5fd' : getCategoryColor(category as Category).includes('green') ? '#86efac' : getCategoryColor(category as Category).includes('purple') ? '#c4b5fd' : '#fcd34d' }}></span>
                                <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                              </div>
                              <div>{Math.round((amount / totalAmount) * 100)}%</div>
                            </div>
                            <Progress value={(amount / totalAmount) * 100} className="h-2" />
                          </div>
                        ));
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Guide Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsGuideDialogOpen(true)}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              View User Guide
            </Button>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.slice(0, 3).map(achievement => (
                    <motion.div
                      key={achievement.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-3 rounded-lg border ${
                        achievement.unlocked
                          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                          : 'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700'
                      }`}
                      onClick={() => {
                        setSelectedAchievement(achievement);
                        setIsAchievementDialogOpen(true);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          achievement.unlocked
                            ? 'bg-green-100 dark:bg-green-800'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          {achievement.icon}
                        </div>
                        <div>
                          <div className="font-medium">{achievement.title}</div>
                          <div className="text-xs text-muted-foreground">{achievement.description}</div>
                          {achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                            <div className="mt-1">
                              <div className="text-xs text-muted-foreground mb-1">
                                {achievement.progress} / {achievement.maxProgress}
                              </div>
                              <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-1.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => setIsAchievementDialogOpen(true)}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    View All Achievements
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Guide Dialog */}
      <Dialog open={isGuideDialogOpen} onOpenChange={setIsGuideDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Reminder Guide</DialogTitle>
            <DialogDescription>
              Get the most out of your Finance Buddy
            </DialogDescription>
          </DialogHeader>
          <PaymentReminderGuide />
        </DialogContent>
      </Dialog>

      {/* Feedback Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          className="bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={() => window.open('mailto:feedback@financetools.in', '_blank')}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Feedback
        </Button>
      </div>
    </div>
  );
};

export default PaymentReminderSystem;