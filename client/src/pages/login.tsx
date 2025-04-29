
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FaGoogle } from 'react-icons/fa';
import { BiSolidUser } from 'react-icons/bi';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, googleSignIn, user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await login({ email, password });
      // Toast is handled in the login function
    } catch (error) {
      // Error toast is handled in the login function
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      await googleSignIn();
      // Toast is handled in the googleSignIn function
    } catch (error) {
      // Error toast is handled in the googleSignIn function
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access all your Finance Tools features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-12 text-base font-medium"
            onClick={handleGoogleSignIn}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <FaGoogle className="mr-2 h-5 w-5 text-red-500" />
            )}
            Continue with Google
          </Button>

          <div className="flex items-center">
            <Separator className="flex-1" />
            <span className="px-3 text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <BiSolidUser className="mr-2 h-5 w-5" />
              )}
              Sign In with Email
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 pb-6">
          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{' '}
            <a href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </a>
          </p>
          <p className="text-xs text-center text-muted-foreground mt-4">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and{' '}
            <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
