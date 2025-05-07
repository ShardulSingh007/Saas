import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Expense {
  id: number;
  userId: number;
  amount: number;
  category: string;
  description: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

export default function AdminExpenses() {
  const [page, setPage] = useState(1);
  
  const { data, isLoading } = useQuery<{ expenses: Expense[], total: number }>({
    queryKey: ['admin', 'expenses', page],
    queryFn: async () => {
      const response = await fetch(`/api/admin/expenses?page=${page}&limit=${ITEMS_PER_PAGE}`);
      if (!response.ok) throw new Error('Failed to fetch expenses');
      return response.json();
    },
  });

  const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0;

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
        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.id}</TableCell>
                    <TableCell>{expense.userId}</TableCell>
                    <TableCell>${expense.amount.toFixed(2)}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>
                      {format(new Date(expense.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    </ProtectedRoute>
  );
} 