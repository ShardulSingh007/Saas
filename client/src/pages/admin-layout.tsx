import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  User,
  Bell,
  LogOut,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Invoices', href: '/admin/invoices', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Profile', href: '/admin/profile', icon: User },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="h-16 flex items-center justify-center border-b">
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>
          <nav className="mt-5 px-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start mb-2 ${
                    isActive ? 'bg-primary text-white' : 'text-gray-600'
                  }`}
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              );
            })}
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <main className="p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
} 