
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FaGoogle } from 'react-icons/fa';
import { BiSolidUserPlus } from 'react-icons/bi';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { signup, googleSignIn, user, isLoading } = useAuth();
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
    setIsSigningUp(true);
    try {
      await signup({ name, email, password });
      // Toast is handled in the signup function
    } catch (error) {
      // Error toast is handled in the signup function
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSigningUp(true);
    try {
      await googleSignIn();
      // Toast is handled in the googleSignIn function
    } catch (error) {
      // Error toast is handled in the googleSignIn function
    } finally {
      setIsSigningUp(false);
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
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>
            Sign up to access all Finance Tools features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-12 text-base font-medium"
            onClick={handleGoogleSignIn}
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <FaGoogle className="mr-2 h-5 w-5 text-red-500" />
            )}
            Sign up with Google
          </Button>

          <div className="flex items-center">
            <Separator className="flex-1" />
            <span className="px-3 text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email Address"
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
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <BiSolidUserPlus className="mr-2 h-5 w-5" />
              )}
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 pb-6">
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </a>
          </p>
          <p className="text-xs text-center text-muted-foreground mt-4">
            By signing up, you agree to our{' '}
            <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and{' '}
            <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
