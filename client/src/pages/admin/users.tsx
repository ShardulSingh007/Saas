import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  isBlocked: boolean;
  createdAt: string;
}

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
  });

  const handleBlockUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/block`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to block user');
      // Invalidate and refetch users
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.isAdmin ? 'primary' : 'default'}>
                      {user.isAdmin ? 'Admin' : 'User'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isBlocked ? 'danger' : 'success'}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleBlockUser(user.id)}
                      disabled={user.isAdmin}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
} 