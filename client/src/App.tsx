import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TaxCalculatorProvider } from "@/components/TaxCalculator/TaxCalculatorProvider";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { CurrencyProvider } from "@/hooks/use-currency";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from '@/pages/login';
import Register from '@/pages/signup';
import AdminDashboard from '@/pages/admin/dashboard';
import AdminUsers from '@/pages/admin/users';
import AdminInvoices from '@/pages/admin/invoices';
import AdminExpenses from '@/pages/admin/expenses';
import AdminReminders from '@/pages/admin/reminders';
import AdminFeedback from '@/pages/admin/feedback';
import AdminSettings from '@/pages/admin/settings';
import InvoiceGenerator from "@/pages/invoice-generator";
import ExpenseTracker from "@/pages/expense-tracker";
import PaymentReminderSystem from "@/pages/payment-reminder";
import PrivacyPolicy from "./pages/privacy-policy";
import Terms from "./pages/terms";
import Disclaimer from "./pages/disclaimer";
import About from "./pages/about";
import Contact from "./pages/contact";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";
import FloatingFeedback from "./components/FloatingFeedback";
import AdminLogin from "@/pages/admin/login";
import { AdminLayout } from "@/layouts/AdminLayout";
import Footer from "@/components/Footer";
import TaxCalculatorPage from "@/pages/tax-calculator";

const queryClient = new QueryClient();

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/admin/login" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="financepilot-theme">
        <TooltipProvider>
          <CurrencyProvider>
            <TaxCalculatorProvider>
              <ErrorBoundary>
                <Router>
                  <AuthProvider>
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <main className="flex-1">
                        <Suspense fallback={<LoadingSpinner />}>
                          <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Register />} />
                            <Route path="/invoice-generator" element={<InvoiceGenerator />} />
                            <Route path="/expense-tracker" element={<ExpenseTracker />} />
                            <Route path="/payment-reminder" element={<PaymentReminderSystem />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/terms" element={<Terms />} />
                            <Route path="/disclaimer" element={<Disclaimer />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/tax-calculator" element={<TaxCalculatorPage />} />

                            {/* Protected Routes */}
                            <Route
                              path="/profile"
                              element={
                                <ProtectedRoute>
                                  <Home />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/settings"
                              element={
                                <ProtectedRoute>
                                  <Home />
                                </ProtectedRoute>
                              }
                            />

                            {/* Admin Routes */}
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route
                              path="/admin"
                              element={
                                <AdminRoute>
                                  <AdminLayout />
                                </AdminRoute>
                              }
                            >
                              <Route index element={<Navigate to="/admin/dashboard" replace />} />
                              <Route path="dashboard" element={<AdminDashboard />} />
                              <Route path="users" element={<AdminUsers />} />
                              <Route path="invoices" element={<AdminInvoices />} />
                              <Route path="expenses" element={<AdminExpenses />} />
                              <Route path="reminders" element={<AdminReminders />} />
                              <Route path="feedback" element={<AdminFeedback />} />
                              <Route path="settings" element={<AdminSettings />} />
                            </Route>

                            {/* 404 Route */}
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </Suspense>
                      </main>
                      <Toaster />
                      <Footer />
                    </div>
                  </AuthProvider>
                </Router>
              </ErrorBoundary>
            </TaxCalculatorProvider>
          </CurrencyProvider>
        </TooltipProvider>
      </ThemeProvider>
      <FloatingFeedback />
    </QueryClientProvider>
  );
}

export default App;