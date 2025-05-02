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
  Calculator
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

export default function AdminDashboard() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <div>Not authorized</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <header className="border-b border-border mb-8">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mr-2">
                Finance
              </span>
              <span className="text-2xl font-bold">Tools</span>
            </div>

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
      <h1>Admin Dashboard</h1>
      {/* Your admin dashboard components here */}
    </div>
  );
}