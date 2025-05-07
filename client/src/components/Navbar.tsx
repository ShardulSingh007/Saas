import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { LogOut, Lock, Sun, Moon, FileText, DollarSign, PieChart, Bell, Menu, UserCircle } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { CurrencySelector } from "@/components/CurrencySelector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="border-b border-border bg-black">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          {/* Brand Logo - Gradient and Bold */}
          <Link to="/" className="text-xl font-bold flex items-center select-none">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Finance</span>
            <span className="text-white font-extrabold ml-1">Pilot</span>
          </Link>

          <div className="hidden md:flex space-x-2 ml-8">
            <Link to="/tax-calculator">
              <Button
                variant={location.pathname === "/tax-calculator" ? "default" : "ghost"}
                className={`flex items-center ${location.pathname === "/tax-calculator" ? "bg-blue-500 text-white" : "text-white hover:bg-gray-800"} font-medium px-4`}
              >
                <PieChart className="mr-1 h-4 w-4" />
                Tax Calculator
              </Button>
            </Link>
            <Link to="/invoice-generator">
              <Button
                variant={location.pathname === "/invoice-generator" ? "default" : "ghost"}
                className={`flex items-center ${location.pathname === "/invoice-generator" ? "bg-blue-500 text-white" : "text-white hover:bg-gray-800"} font-medium px-4`}
              >
                <FileText className="mr-1 h-4 w-4" />
                Invoice Generator
              </Button>
            </Link>
            <Link to="/expense-tracker">
              <Button
                variant={location.pathname === "/expense-tracker" ? "default" : "ghost"}
                className={`flex items-center ${location.pathname === "/expense-tracker" ? "bg-blue-500 text-white" : "text-white hover:bg-gray-800"} font-medium px-4`}
              >
                <DollarSign className="mr-1 h-4 w-4" />
                Expense Tracker
              </Button>
            </Link>
            <Link to="/payment-reminder">
              <Button
                variant={location.pathname === "/payment-reminder" ? "default" : "ghost"}
                className={`flex items-center ${location.pathname === "/payment-reminder" ? "bg-blue-500 text-white" : "text-white hover:bg-gray-800"} font-medium px-4`}
              >
                <Bell className="mr-1 h-4 w-4" />
                Payment Reminders
              </Button>
            </Link>
          </div>
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          <div 
            className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border p-4 space-y-2 z-50 shadow-lg`}
            aria-expanded={mobileMenuOpen}
            role="navigation"
          >
            <Link to="/invoice-generator">
              <Button variant={location.pathname === "/invoice-generator" ? "default" : "ghost"} className="w-full justify-start">
                <FileText className="mr-1 h-4 w-4" />
                <span className="font-medium">Invoice Generator</span>
              </Button>
            </Link>
            <Link to="/expense-tracker">
              <Button variant={location.pathname === "/expense-tracker" ? "default" : "ghost"} className="w-full justify-start">
                <DollarSign className="mr-1 h-4 w-4" />
                <span className="font-medium">Expense Tracker</span>
              </Button>
            </Link>
            <Link to="/payment-reminder">
              <Button variant={location.pathname === "/payment-reminder" ? "default" : "ghost"} className="w-full justify-start">
                <Bell className="mr-1 h-4 w-4" />
                <span className="font-medium">Payment Reminders</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="mr-2">
            <CurrencySelector />
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="mr-2"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.name ? user.name[0] : "U"}</AvatarFallback>
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
          ) : (
            <div className="flex space-x-2">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}