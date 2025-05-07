import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Sun, Moon, Users, FileText, DollarSign, Bell, MessageCircle, Settings, LogOut, BarChart2, Mail } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { CurrencySelector } from '@/components/CurrencySelector';

const navItems = [
  { label: 'Dashboard', icon: <BarChart2 />, path: '/admin/dashboard' },
  { label: 'Users', icon: <Users />, path: '/admin/users' },
  { label: 'Invoices', icon: <FileText />, path: '/admin/invoices' },
  { label: 'Expenses', icon: <DollarSign />, path: '/admin/expenses' },
  { label: 'Reminders', icon: <Bell />, path: '/admin/reminders' },
  { label: 'Feedback', icon: <MessageCircle />, path: '/admin/feedback' },
  { label: 'Contact Messages', icon: <Mail />, path: '/admin/contact-messages' },
  { label: 'Settings', icon: <Settings />, path: '/admin/settings' },
];

export const AdminDashboardLayout: React.FC = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#18181b]">
      {/* Sidebar */}
      <aside className={`z-30 fixed md:static top-0 left-0 h-full w-64 bg-white dark:bg-[#232336] border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">FinancePilot</span>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>&times;</button>
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${location.pathname === item.path ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          <Link to="/admin-login" className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900 mt-4">
            <LogOut />
            <span>Logout</span>
          </Link>
        </nav>
      </aside>
      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />}
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-10 bg-white dark:bg-[#18181b] border-b border-gray-200 dark:border-gray-800 flex items-center h-16 px-4 justify-between">
          <div className="flex items-center gap-2">
            <button className="md:hidden mr-2" onClick={() => setSidebarOpen(true)}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
            </button>
            <input type="text" placeholder="Search..." className="rounded-md px-3 py-1 bg-gray-100 dark:bg-[#232336] text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="flex items-center gap-3">
            <CurrencySelector />
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {/* Admin avatar dropdown (placeholder) */}
            <div className="relative group">
              <button className="flex items-center gap-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                <span className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">A</span>
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#232336] rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-20">
                <Link to="/admin/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Profile</Link>
                <Link to="/admin/settings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Settings</Link>
                <Link to="/admin-login" className="block px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900">Logout</Link>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 bg-gray-50 dark:bg-[#18181b] min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}; 