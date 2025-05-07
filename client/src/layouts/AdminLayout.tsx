import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/hooks/use-auth';
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  Bell,
  MessageSquare,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  ChevronRight,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: FileText, label: 'Invoices', href: '/admin/invoices' },
    { icon: Receipt, label: 'Expenses', href: '/admin/expenses' },
    { icon: Bell, label: 'Reminders', href: '/admin/reminders' },
    { icon: MessageSquare, label: 'Feedback', href: '/admin/feedback' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  const toolLinks = [
    { label: 'Tax Calculator', path: '/tax-calculator' },
    { label: 'Invoice Generator', path: '/invoice-generator' },
    { label: 'Expense Tracker', path: '/expense-tracker' },
    { label: 'Payment Reminders', path: '/payment-reminders' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 px-4 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
          {/* Left: Logo */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link to="/admin/dashboard" className="text-xl font-bold">
              FinancePilot
            </Link>
          </div>

          {/* Center: Tool Links */}
          <div className="hidden md:flex items-center space-x-6">
            {toolLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name || 'Admin'} />
                    <AvatarFallback>{user?.name?.[0] || 'A'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-background/80 backdrop-blur-sm border-r transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 bg-background/50"
            />
          </div>
        </div>
        <nav className="px-2 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {isActive ? (
                  <ChevronDown className="ml-auto h-4 w-4" />
                ) : (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-200 ease-in-out ${
          isSidebarOpen ? 'lg:ml-64' : ''
        }`}
      >
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 