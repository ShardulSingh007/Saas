import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Reminder {
  id: number;
  userId: number;
  title: string;
  amount: number;
  category: string;
  status: 'upcoming' | 'overdue' | 'paid';
  dueDate: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

export default function AdminReminders() {
  const [page, setPage] = useState(1);
  
  const { data, isLoading } = useQuery<{ reminders: Reminder[], total: number }>({
    queryKey: ['admin', 'reminders', page],
    queryFn: async () => {
      const response = await fetch(`/api/admin/reminders?page=${page}&limit=${ITEMS_PER_PAGE}`);
      if (!response.ok) throw new Error('Failed to fetch reminders');
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
            <CardTitle>Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.reminders.map((reminder) => (
                  <TableRow key={reminder.id}>
                    <TableCell>{reminder.id}</TableCell>
                    <TableCell>{reminder.userId}</TableCell>
                    <TableCell>{reminder.title}</TableCell>
                    <TableCell>${reminder.amount.toFixed(2)}</TableCell>
                    <TableCell>{reminder.category}</TableCell>
                    <TableCell>{reminder.status}</TableCell>
                    <TableCell>
                      {format(new Date(reminder.dueDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(reminder.createdAt), 'MMM d, yyyy')}
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