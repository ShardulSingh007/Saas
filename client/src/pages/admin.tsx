import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/lib/taxCalculator";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart3, 
  Users, 
  Settings, 
  PieChart, 
  TrendingUp,
  FileText,
  Globe,
  AlertTriangle,
  Calculator,
  Receipt,
  DollarSign,
  Coins,
  Bell,
  Calendar,
  Clock,
  Lock
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Mock data for demo purposes
const mockData = {
  userCount: 1245,
  totalCalculations: 8936,
  totalInvoices: 3452,
  totalExpenses: 12783,
  countriesUsed: 32,
  recentActivity: [
    { id: 1, username: "user123", country: "us", taxYear: 2023, totalTax: 12500, date: "2023-04-25" },
    { id: 2, username: "taxsaver22", country: "ca", taxYear: 2023, totalTax: 14750, date: "2023-04-25" },
    { id: 3, username: "james_finance", country: "uk", taxYear: 2023, totalTax: 9800, date: "2023-04-24" },
    { id: 4, username: "tax_planner", country: "au", taxYear: 2023, totalTax: 11250, date: "2023-04-24" },
    { id: 5, username: "invest_smart", country: "in", taxYear: 2023, totalTax: 5600, date: "2023-04-23" },
    { id: 6, username: "future_plan", country: "fr", taxYear: 2023, totalTax: 13200, date: "2023-04-23" },
    { id: 7, username: "money_wise", country: "de", taxYear: 2023, totalTax: 15800, date: "2023-04-22" },
    { id: 8, username: "global_tax", country: "jp", taxYear: 2023, totalTax: 8900, date: "2023-04-22" },
  ],
  recentInvoices: [
    { id: 1, username: "business1", invoiceNumber: "INV-2023-001", amount: 1250, status: "paid", date: "2023-04-25" },
    { id: 2, username: "creative_co", invoiceNumber: "INV-2023-042", amount: 2300, status: "unpaid", date: "2023-04-24" },
    { id: 3, username: "design_studio", invoiceNumber: "INV-2023-103", amount: 1760, status: "paid", date: "2023-04-24" },
    { id: 4, username: "tech_services", invoiceNumber: "INV-2023-204", amount: 3200, status: "partial", date: "2023-04-23" },
    { id: 5, username: "marketing_inc", invoiceNumber: "INV-2023-315", amount: 2150, status: "draft", date: "2023-04-23" },
    { id: 6, username: "consulting_llc", invoiceNumber: "INV-2023-429", amount: 4500, status: "paid", date: "2023-04-22" },
  ],
  countryStats: [
    { country: "United States", calculations: 3245, percentage: 36.3 },
    { country: "Canada", calculations: 1532, percentage: 17.2 },
    { country: "United Kingdom", calculations: 1124, percentage: 12.6 },
    { country: "Australia", calculations: 891, percentage: 10.0 },
    { country: "India", calculations: 745, percentage: 8.3 },
    { country: "Other", calculations: 1399, percentage: 15.6 },
  ],
  popularYears: [
    { year: 2023, calculations: 4382, percentage: 49.0 },
    { year: 2022, calculations: 2789, percentage: 31.2 },
    { year: 2021, calculations: 1103, percentage: 12.3 },
    { year: 2020, calculations: 452, percentage: 5.1 },
    { year: 2019, calculations: 210, percentage: 2.4 },
  ],
  invoiceStats: [
    { status: "Paid", count: 1872, percentage: 54.2 },
    { status: "Unpaid", count: 986, percentage: 28.6 },
    { status: "Partial", count: 347, percentage: 10.1 },
    { status: "Draft", count: 247, percentage: 7.1 },
  ],
  systemAlerts: [
    { id: 1, type: "warning", message: "High server load detected", time: "2 hours ago" },
    { id: 2, type: "info", message: "New tax year data updated", time: "1 day ago" },
    { id: 3, type: "success", message: "Database backup completed", time: "2 days ago" },
    { id: 4, type: "info", message: "Invoice payment gateway updated", time: "3 days ago" },
  ],
  recentExpenses: [
    { id: 1, username: "user123", category: "Food", amount: 75.20, description: "Grocery shopping", date: "2023-04-25" },
    { id: 2, username: "finance_guru", category: "Transportation", amount: 45.50, description: "Uber ride", date: "2023-04-25" },
    { id: 3, username: "penny_wise", category: "Entertainment", amount: 32.75, description: "Movie tickets", date: "2023-04-24" },
    { id: 4, username: "budget_master", category: "Shopping", amount: 128.90, description: "New clothes", date: "2023-04-24" },
    { id: 5, username: "saver101", category: "Bills", amount: 210.50, description: "Electricity bill", date: "2023-04-23" },
    { id: 6, username: "money_manager", category: "Health", amount: 85.30, description: "Pharmacy", date: "2023-04-23" }
  ],
  expenseCategories: [
    { category: "Food", total: 3482.50, percentage: 27.2 },
    { category: "Transportation", total: 2145.30, percentage: 16.8 },
    { category: "Entertainment", total: 1863.70, percentage: 14.6 },
    { category: "Shopping", total: 2057.20, percentage: 16.1 },
    { category: "Bills", total: 1986.40, percentage: 15.5 },
    { category: "Health", total: 1248.90, percentage: 9.8 }
  ],
  aiChatStats: {
    totalChats: 3245,
    averageSessionTime: "4m 12s",
    topQuestions: [
      { topic: "Budgeting tips", count: 842 },
      { topic: "Debt management", count: 756 },
      { topic: "Saving strategies", count: 693 },
      { topic: "Expense analysis", count: 574 },
      { topic: "Investment advice", count: 380 }
    ]
  },
  paymentReminders: {
    totalReminders: 2487,
    totalPaid: 1564,
    totalUpcoming: 684,
    totalOverdue: 239,
    recentReminders: [
      { id: 1, username: "user123", title: "Monthly Rent", amount: 1200, dueDate: "2023-04-28", status: "upcoming", category: "rent" },
      { id: 2, username: "finance_guru", title: "Internet Bill", amount: 85.75, dueDate: "2023-04-27", status: "upcoming", category: "utilities" },
      { id: 3, username: "penny_wise", title: "Car Insurance", amount: 124.50, dueDate: "2023-04-24", status: "overdue", category: "insurance" },
      { id: 4, username: "budget_master", title: "Gym Membership", amount: 49.99, dueDate: "2023-04-22", status: "paid", category: "subscriptions" },
      { id: 5, username: "saver101", title: "Credit Card Payment", amount: 350.00, dueDate: "2023-04-20", status: "paid", category: "credit-card" },
      { id: 6, username: "money_manager", title: "Streaming Services", amount: 24.99, dueDate: "2023-04-18", status: "paid", category: "subscriptions" }
    ],
    reminderCategories: [
      { category: "utilities", count: 580, percentage: 23.3 },
      { category: "subscriptions", count: 524, percentage: 21.1 },
      { category: "credit-card", count: 412, percentage: 16.6 },
      { category: "rent", count: 310, percentage: 12.5 },
      { category: "insurance", count: 285, percentage: 11.5 },
      { category: "other", count: 376, percentage: 15.0 }
    ],
    notificationStats: {
      email: 78.2,
      sms: 45.7,
      push: 62.3,
      whatsapp: 34.8
    },
    emotionalToneUsage: [
      { tone: "gentle", percentage: 42.6 },
      { tone: "professional", percentage: 38.2 },
      { tone: "urgent", percentage: 19.2 }
    ]
  }
};

// Country codes to flag emoji conversion
function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Country code to full name
const countryNames: {[key: string]: string} = {
  us: "United States",
  ca: "Canada",
  uk: "United Kingdom",
  au: "Australia",
  in: "India",
  fr: "France",
  de: "Germany",
  jp: "Japan",
};

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // This would normally fetch data from the server
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      // In a real application, this would be an API call
      return mockData;
    },
    // For demo purposes, start with mock data
    initialData: mockData,
  });

  return (
    <div>
      {/* Admin header bar */}
      <header className="border-b border-border mb-8">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {/* Brand Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mr-2">
                Finance
              </span>
              <span className="text-2xl font-bold">Tools</span>
            </div>
            
            {/* Main navigation */}
            <div className="hidden md:flex space-x-4 ml-8">
              <Button 
                variant="default" 
                className="flex items-center bg-blue-600 hover:bg-blue-700"
                onClick={() => window.location.href = "/admin"}
              >
                <Lock className="mr-1 h-4 w-4" />
                <span className="font-medium">Administrator</span>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => window.location.href = "/"}
            >
              Return to Site
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name || "Admin"}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Badge variant="outline" className="mr-2 bg-primary/10">
              Admin Access
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="tax-calculator">
              <Calculator className="h-4 w-4 mr-2" />
              Tax Calculator
            </TabsTrigger>
            <TabsTrigger value="invoice-generator">
              <Receipt className="h-4 w-4 mr-2" />
              Invoice Generator
            </TabsTrigger>
            <TabsTrigger value="expense-tracker">
              <DollarSign className="h-4 w-4 mr-2" />
              Expense Tracker
            </TabsTrigger>
            <TabsTrigger value="payment-reminder">
              <Bell className="h-4 w-4 mr-2" />
              Payment Reminders
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Key metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.userCount.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tax Calculations
                  </CardTitle>
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCalculations.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +23% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Invoices Generated
                  </CardTitle>
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalInvoices.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +18% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Countries Used
                  </CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.countriesUsed}</div>
                  <p className="text-xs text-muted-foreground">
                    +4 new countries since last month
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage user accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">
                    User management functionality would be implemented here.
                  </p>
                  <Button variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    View All Users
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tax-calculator">
            <Card>
              <CardHeader>
                <CardTitle>Tax Calculator Admin</CardTitle>
                <CardDescription>
                  Manage tax calculation settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">
                    Tax calculator administration would be implemented here.
                  </p>
                  <Button variant="outline">
                    <Calculator className="h-4 w-4 mr-2" />
                    View Tax Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="invoice-generator">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Generator Admin</CardTitle>
                <CardDescription>
                  Manage invoice templates and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">
                    Invoice generator administration would be implemented here.
                  </p>
                  <Button variant="outline">
                    <Receipt className="h-4 w-4 mr-2" />
                    Manage Invoice Templates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="expense-tracker">
            <Card>
              <CardHeader>
                <CardTitle>Expense Tracker Admin</CardTitle>
                <CardDescription>
                  Configure expense categories and analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">
                    Expense tracker administration would be implemented here.
                  </p>
                  <Button variant="outline">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Manage Expense Categories
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment-reminder">
            <Card>
              <CardHeader>
                <CardTitle>Payment Reminder Admin</CardTitle>
                <CardDescription>
                  Configure payment reminder settings and defaults
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">
                    Payment reminder administration would be implemented here.
                  </p>
                  <Button variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    Manage Reminder Templates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system-wide settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">
                    System administration settings would be implemented here.
                  </p>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    System Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;