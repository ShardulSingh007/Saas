import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Key, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function AdminLogin() {
  const [secretKey, setSecretKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { adminLogin, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!secretKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter the secret key',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Submitting secret key:', secretKey.trim());
      await adminLogin.mutateAsync({ secretKey: secretKey.trim() });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Invalid secret key.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-500/10">
              <Key className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-white">
            Admin Access
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter the secret key to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="secretKey" className="text-gray-300">Secret Key</Label>
              <Input
                id="secretKey"
                type="password"
                placeholder="Enter secret key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                required
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Access Dashboard'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 