import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApi } from '@/lib/admin-api';
import { toast } from '@/components/ui/use-toast';
import { Bell, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error';
  message: string;
  createdAt: string;
  read: boolean;
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await adminApi.getNotifications();
      if (response.error) {
        throw new Error(response.error);
      }
      setNotifications(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch notifications.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await adminApi.markNotificationAsRead(id);
      if (response.error) {
        throw new Error(response.error);
      }

      setNotifications(notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      ));

      toast({
        title: 'Success',
        description: 'Notification marked as read.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read.',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await adminApi.markAllNotificationsAsRead();
      if (response.error) {
        throw new Error(response.error);
      }

      setNotifications(notifications.map(notification => ({
        ...notification,
        read: true,
      })));

      toast({
        title: 'Success',
        description: 'All notifications marked as read.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await adminApi.deleteNotification(id);
      if (response.error) {
        throw new Error(response.error);
      }

      setNotifications(notifications.filter(notification => notification.id !== id));

      toast({
        title: 'Success',
        description: 'Notification deleted.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete notification.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {notifications.some(notification => !notification.read) && (
          <Button onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No notifications to display
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-4 p-4 border rounded-lg ${
                    notification.read ? 'bg-muted/50' : 'bg-white'
                  }`}
                >
                  {notification.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : notification.type === 'warning' ? (
                    <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'font-medium'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 