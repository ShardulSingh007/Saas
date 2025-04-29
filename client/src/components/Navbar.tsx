import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Lock, Sun, Moon, FileText, DollarSign, PieChart, Bell, Menu, UserCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { CurrencySelector } from "@/components/CurrencySelector";

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [_, navigate] = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          {/* Brand Logo - Always Visible */}
          <Link href="/">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mr-2">
                Finance
              </span>
              <span className="text-2xl font-bold">Tools</span>
            </div>
          </Link>

          <div className="hidden md:flex space-x-4 ml-8">
            <Link href="/">
              <Button variant={useLocation()[0] === "/" ? "default" : "ghost"} className="flex items-center">
                <PieChart className="mr-1 h-4 w-4" />
                <span className="font-medium">Tax Calculator</span>
              </Button>
            </Link>

            <Link href="/invoice-generator">
              <Button variant={useLocation()[0] === "/invoice-generator" ? "default" : "ghost"} className="flex items-center">
                <FileText className="mr-1 h-4 w-4" />
                <span className="font-medium">Invoice Generator</span>
              </Button>
            </Link>

            <Link href="/expense-tracker">
              <Button variant={useLocation()[0] === "/expense-tracker" ? "default" : "ghost"} className="flex items-center">
                <DollarSign className="mr-1 h-4 w-4" />
                <span className="font-medium">Expense Tracker</span>
              </Button>
            </Link>

            <Link href="/payment-reminder">
              <Button variant={useLocation()[0] === "/payment-reminder" ? "default" : "ghost"} className="flex items-center">
                <Bell className="mr-1 h-4 w-4" />
                <span className="font-medium">Payment Reminders</span>
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
            <Link href="/">
              <Button variant={useLocation()[0] === "/" ? "default" : "ghost"} className="w-full justify-start">
                <PieChart className="mr-1 h-4 w-4" />
                <span className="font-medium">Tax Calculator</span>
              </Button>
            </Link>
            <Link href="/invoice-generator">
              <Button variant={useLocation()[0] === "/invoice-generator" ? "default" : "ghost"} className="w-full justify-start">
                <FileText className="mr-1 h-4 w-4" />
                <span className="font-medium">Invoice Generator</span>
              </Button>
            </Link>
            <Link href="/expense-tracker">
              <Button variant={useLocation()[0] === "/expense-tracker" ? "default" : "ghost"} className="w-full justify-start">
                <DollarSign className="mr-1 h-4 w-4" />
                <span className="font-medium">Expense Tracker</span>
              </Button>
            </Link>
            <Link href="/payment-reminder">
              <Button variant={useLocation()[0] === "/payment-reminder" ? "default" : "ghost"} className="w-full justify-start">
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
            <>
              <div className="hidden md:flex items-center">
                <div className="flex items-center space-x-2 bg-muted/40 rounded-full py-1 px-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm font-medium overflow-hidden text-ellipsis max-w-[150px]">
                    {user.name || user.email}
                  </div>
                </div>
              </div>

              

              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </>
          ) : (
            <div className="flex space-x-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => navigate("/signup")}
                className="hidden md:flex"
              >
                Sign Up
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => navigate("/login")}
              >
                <UserCircle className="h-4 w-4 mr-1" />
                <span className="md:inline">Login</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}