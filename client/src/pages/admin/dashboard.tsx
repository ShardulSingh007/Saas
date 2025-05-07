import { type FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Users, FileText, Receipt, PiggyBank, Bell, MessageSquare, TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalInvoices: number;
  totalExpenses: number;
  taxSaved: number;
  totalReminders: number;
  totalFeedback: number;
  userGrowth: number;
  invoiceGrowth: number;
  expenseGrowth: number;
  taxSavedGrowth: number;
  reminderGrowth: number;
  feedbackGrowth: number;
}

const AdminDashboard: FC = () => {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
  });

  const widgets = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      growth: stats?.userGrowth || 0,
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Invoices',
      value: stats?.totalInvoices || 0,
      growth: stats?.invoiceGrowth || 0,
      icon: FileText,
      color: 'text-green-500',
    },
    {
      title: 'Expenses',
      value: stats?.totalExpenses || 0,
      growth: stats?.expenseGrowth || 0,
      icon: Receipt,
      color: 'text-orange-500',
    },
    {
      title: 'Tax Saved',
      value: `$${stats?.taxSaved.toLocaleString() || 0}`,
      growth: stats?.taxSavedGrowth || 0,
      icon: PiggyBank,
      color: 'text-purple-500',
    },
    {
      title: 'Reminders',
      value: stats?.totalReminders || 0,
      growth: stats?.reminderGrowth || 0,
      icon: Bell,
      color: 'text-red-500',
    },
    {
      title: 'Feedback',
      value: stats?.totalFeedback || 0,
      growth: stats?.feedbackGrowth || 0,
      icon: MessageSquare,
      color: 'text-yellow-500',
    },
  ];

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex h-96 items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Admin 👋</h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your business today.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search anything..."
            className="pl-9 bg-background/50"
          />
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {widgets.map((widget) => {
            const Icon = widget.icon;
            const isPositive = widget.growth >= 0;
            return (
              <Card key={widget.title} className="bg-background/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {widget.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${widget.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{widget.value}</div>
                  <div className="flex items-center pt-1">
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(widget.growth)}%
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Floating Feedback Button */}
        <Button
          className="fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          Feedback
        </Button>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminDashboard; 