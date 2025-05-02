import React, { Suspense } from "react";
import { Switch, Route, Link, Redirect } from "wouter";
const LoginPage = React.lazy(() => import("@/pages/login"));
import SignupPage from "@/pages/signup";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TaxCalculatorProvider } from "@/components/TaxCalculator/TaxCalculatorProvider";
import { AuthProvider } from "@/hooks/use-auth";
import { CurrencyProvider } from "@/hooks/use-currency";
import { AdminProtectedRoute } from "@/lib/protected-route";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/Navbar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import AdminLogin from "@/pages/admin-login";
import InvoiceGenerator from "@/pages/invoice-generator";
import ExpenseTracker from "@/pages/expense-tracker";
import PaymentReminderSystem from "@/pages/payment-reminder";
import PrivacyPolicy from "./pages/privacy-policy";
import Terms from "./pages/terms";
import Disclaimer from "./pages/disclaimer";
import About from "./pages/about";
import Contact from "./pages/contact";
import ErrorBoundary from "@/components/ErrorBoundary"; // Added Error Boundary component
import LoadingSpinner from "@/components/LoadingSpinner"; // Added Loading Spinner component


import { useAuth } from "@/hooks/use-auth";

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType, adminOnly?: boolean }) {
  const { user, isLoading, isAdmin } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Redirect to="/login" />;
  }
  
  if (adminOnly && !isAdmin) {
    console.log("User is not admin, redirecting to home");
    return <Redirect to="/" />;
  }
  
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin">
        <AdminProtectedRoute path="/admin" component={Admin} />
      </Route>
      <Route path="/invoice-generator" component={InvoiceGenerator} />
      <Route path="/expense-tracker" component={ExpenseTracker} />
      <Route path="/payment-reminder" component={PaymentReminderSystem} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms" component={Terms} />
      <Route path="/disclaimer" component={Disclaimer} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-100 p-4 text-gray-700">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-2">Quick Links</h3>
            <ul>
              <li><Link href="/invoice-generator">Invoice Generator</Link></li>
              <li><Link href="/">Tax Calculator</Link></li>
              <li><Link href="/expense-tracker">Expense Tracker (AI)</Link></li>
              <li><Link href="/payment-reminder">Payment Reminder (AI)</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Legal</h3>
            <ul>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li> {/* Corrected link */}
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/disclaimer">Disclaimer</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Company</h3>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
          © 2025 Finance Tools.IN All rights reserved.
        </div>
      </div>
    </footer>
  );
}


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <AuthProvider>
            <CurrencyProvider>
              <TaxCalculatorProvider>
                <ErrorBoundary> {/* Added Error Boundary */}
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-1">
                      <React.Suspense fallback={<LoadingSpinner />}> {/* Added Suspense */}
                        <Router />
                      </React.Suspense>
                    </main>
                    <Footer />
                    <Toaster />
                  </div>
                </ErrorBoundary> {/* Closed Error Boundary */}
              </TaxCalculatorProvider>
            </CurrencyProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;