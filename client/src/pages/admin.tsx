import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart3, Users, Settings, LogOut, ArrowLeft, Bell, Calendar, AlertTriangle, Clock, Loader2, LayoutDashboard, Activity, FileText, Calculator, Receipt, Download, Menu, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

interface PaymentReminder {
  id: string;
  userId: number;
  title: string;
  amount: number;
  category: string;
  status: 'upcoming' | 'overdue' | 'paid';
  dueDate: string;
}

interface Stats {
  totalUsers: number;
  totalTransactions: number;
  paymentReminders: {
    totalReminders: number;
    totalUpcoming: number;
    totalOverdue: number;
    totalPaid: number;
    reminderCategories: Array<{
      category: string;
      count: number;
      percentage: number;
    }>;
    notificationStats: {
      email: number;
      sms: number;
      push: number;
      whatsapp: number;
    };
  };
}

const sidebarItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { name: 'Users', icon: Users, href: '/admin/users' },
  { name: 'Activity Log', icon: Activity, href: '/admin/activity' },
  { name: 'Invoices', icon: FileText, href: '/admin/invoices' },
  { name: 'Tax Calculator', icon: Calculator, href: '/admin/tax-calculations' },
  { name: 'Expenses', icon: Receipt, href: '/admin/expenses' },
  { name: 'Payment Reminders', icon: Bell, href: '/admin/reminders' },
];

export default function AdminDashboard() {
  const { user, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = React.useState("overview");
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Check authentication and redirect if not admin
  React.useEffect(() => {
    if (!isLoading && !user?.isAdmin) {
      navigate('/admin-login');
    }
  }, [user, isLoading, navigate]);

  // Only fetch data if user is authenticated as admin
  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
    enabled: !!user?.isAdmin && activeTab === 'users'
  });

  const { data: stats = {
    totalUsers: 0,
    totalTransactions: 0,
    paymentReminders: {
      totalReminders: 0,
      totalUpcoming: 0,
      totalOverdue: 0,
      totalPaid: 0,
      reminderCategories: [],
      notificationStats: {
        email: 0,
        sms: 0,
        push: 0,
        whatsapp: 0
      }
    }
  }, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stats', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
    enabled: !!user?.isAdmin
  });

  const { data: recentReminders = [], isLoading: remindersLoading } = useQuery<PaymentReminder[]>({
    queryKey: ['admin', 'recent-reminders'],
    queryFn: async () => {
      const response = await fetch('/api/admin/recent-reminders', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch recent reminders');
      return response.json();
    },
    enabled: !!user?.isAdmin
  });

  const handleLogout = () => {
    logout();
    toast({
      title: "Success",
      description: "You have been logged out successfully.",
    });
    navigate('/admin-login');
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render anything if not admin (will be redirected)
  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap">
                FinancePilot Admin
              </span>
            </div>
            <div className="flex items-center">
              <Button variant="outline" size="sm" className="mr-2">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <div className="flex items-center ml-3">
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-gray-500">Admin</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white border-r border-gray-200">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = navigate(item.href);
              return (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.href)}
                    className={cn(
                      "flex items-center p-2 text-base font-normal rounded-lg w-full",
                      isActive
                        ? "text-white bg-primary"
                        : "text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="ml-3">{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "p-4 lg:ml-64",
        isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
      )}>
        <div className="p-4 mt-14">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <AnalyticsCard
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              icon={Users}
              trend="+12%"
              trendType="up"
            />
            <AnalyticsCard
              title="Total Reminders"
              value={stats.paymentReminders.totalReminders.toLocaleString()}
              icon={Bell}
              trend="+8%"
              trendType="up"
            />
            <AnalyticsCard
              title="Overdue Payments"
              value={stats.paymentReminders.totalOverdue.toLocaleString()}
              icon={AlertTriangle}
              trendType="down"
              trend="-2%"
            />
            <AnalyticsCard
              title="Paid On Time"
              value={stats.paymentReminders.totalPaid.toLocaleString()}
              icon={Clock}
              trend="+5%"
              trendType="up"
            />
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentReminders.map((reminder) => (
                <ActivityItem
                  key={reminder.id}
                  user={reminder.userId.toString()}
                  action={reminder.title}
                  time={format(new Date(reminder.dueDate), 'MMM d, yyyy')}
                />
              ))}
            </div>
          </div>

          {/* User Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <UserRow
                      key={user.id}
                      name={user.name}
                      email={user.email}
                      joined={format(new Date(user.createdAt), 'MMM d, yyyy')}
                      status={user.isAdmin ? "Admin" : "User"}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsCard({ title, value, icon: Icon, trend, trendType }: {
  title: string;
  value: string;
  icon: any;
  trend: string;
  trendType: 'up' | 'down';
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
      <div className="mt-4">
        <span className={cn(
          "text-sm font-medium",
          trendType === 'up' ? "text-green-600" : "text-red-600"
        )}>
          {trend}
        </span>
        <span className="text-sm text-gray-500 ml-1">from last month</span>
      </div>
    </div>
  );
}

function ActivityItem({ user, action, time }: {
  user: string;
  action: string;
  time: string;
}) {
  return (
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-medium">
            {user.charAt(0)}
          </span>
        </div>
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-900">
          {user} {action}
        </p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    </div>
  );
}

function UserRow({ name, email, joined, status }: {
  name: string;
  email: string;
  joined: string;
  status: string;
}) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-medium">
                {name.charAt(0)}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{joined}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={cn(
          "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
          status === 'Admin' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        )}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button className="text-primary hover:text-primary/80 mr-3">
          View
        </button>
        <button className="text-red-600 hover:text-red-800">
          Block
        </button>
      </td>
    </tr>
  );
}
