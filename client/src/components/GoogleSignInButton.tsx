import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window {
    google: any;
  }
}

export function GoogleSignInButton() {
  const { googleSignIn, isLoading } = useAuth();

  useEffect(() => {
    // Load the Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        { 
          theme: 'outline',
          size: 'large',
          width: '300',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        }
      );
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      await googleSignIn(response.credential);
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  if (isLoading) {
    return (
      <Button variant="outline" className="w-full" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Signing in...
      </Button>
    );
  }

  return (
    <div id="googleSignInButton" className="w-full" />
  );
} 