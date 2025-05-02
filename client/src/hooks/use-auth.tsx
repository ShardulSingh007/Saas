import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { User, LoginCredentials, SignupCredentials } from "@shared/types";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { signInWithGoogle, signOutUser, subscribeToAuthChanges } from "@/lib/firebase";
import { useToast, toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [firebaseUser, setFirebaseUser] = useState<any>(null);

  // Subscribe to Firebase authentication state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setFirebaseUser(user);
      
      // If a user signs in with Firebase, sync with our backend
      if (user) {
        // Convert Firebase user to our User type
        const userProfile: User = {
          id: user.uid,
          name: user.displayName || 'User',
          email: user.email || '',
          role: 'user', // Default role for Firebase users
          signupDate: new Date().toISOString()
        };
        
        // Store in query cache
        queryClient.setQueryData(['user'], userProfile);
      } else {
        // Clear the user from the cache when signed out
        queryClient.setQueryData(['user'], null);
      }
    });
    
    return () => unsubscribe();
  }, [queryClient]);

  // Determine user from either server session or Firebase
  const { data: user, error, isLoading } = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => {
      // If we already have a Firebase user, return that data
      if (firebaseUser) {
        return {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          role: 'user',
          signupDate: new Date().toISOString()
        };
      }
      
      // Otherwise check for a server session
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) return null;
        return res.json();
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const login = async (credentials: LoginCredentials) => {
    try {
      const res = await apiRequest('POST', '/api/auth/login', credentials);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Login failed');
      }
      
      const data = await res.json();
      queryClient.setQueryData(['user'], data);
      
      if (data.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
      
      toast({
        title: "Success",
        description: "Logged in successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Login failed: Invalid credentials",
        variant: "destructive"
      });
      throw error;
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      const res = await apiRequest('POST', '/api/auth/signup', credentials);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Signup failed');
      }
      
      const data = await res.json();
      queryClient.setQueryData(['user'], data);
      navigate('/');
      
      toast({
        title: "Success",
        description: "Account created successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Signup failed",
        variant: "destructive"
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Log out from Firebase if user is logged in via Firebase
      if (firebaseUser) {
        await signOutUser();
      } else {
        // Otherwise log out from server session
        await apiRequest('POST', '/api/auth/logout');
      }
      
      // Clear user data and redirect
      queryClient.setQueryData(['user'], null);
      navigate('/login');
      
      toast({
        title: "Success",
        description: "Logged out successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Logout failed",
        variant: "destructive"
      });
    }
  };

  const googleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      
      if (user) {
        // Create a user object from the Google user info
        const userProfile: User = {
          id: user.uid,
          name: user.displayName || 'User',
          email: user.email || '',
          role: 'user',
          signupDate: new Date().toISOString()
        };
        
        queryClient.setQueryData(['user'], userProfile);
        navigate('/');
        
        toast({
          title: "Success",
          description: "Signed in with Google successfully"
        });
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      toast({
        title: "Error",
        description: "Google sign in failed",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user: user ?? null,
      isLoading,
      error,
      login,
      signup,
      logout,
      googleSignIn,
      isAdmin: user?.isAdmin === true
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const adminLogin = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/admin/login', data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Admin login failed');
      }
      
      const userData = await response.json();
      if (!userData.isAdmin) {
        throw new Error('Not authorized as admin');
      }
      
      console.log("Admin login successful, user data:", userData);
      
      // Update the cached user data
      queryClient.setQueryData(['user'], userData);
      
      // Force refresh user data
      queryClient.invalidateQueries({queryKey: ['user']});
      
      return userData;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Admin login successful',
      });
      
      // Use window.location for a full page refresh/redirect
      window.location.href = '/admin';
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Admin login failed',
        variant: 'destructive',
      });
    },
  });

  return { ...context, adminLogin };
}