import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isAdmin?: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  googleSignIn: (credential: string) => Promise<void>;
  isAdmin: boolean;
  adminLogin: ReturnType<typeof useMutation<User, Error, { secretKey: string }>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Login failed');
      }
      
      const data = await res.json();
      setUser(data);
      queryClient.setQueryData(['user'], data);
      localStorage.setItem('user', JSON.stringify(data));
      
      if (data.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      
      toast({
        title: "Success",
        description: "Logged in successfully",
        variant: "default"
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
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Signup failed');
      }
      
      const data = await res.json();
      setUser(data);
      queryClient.setQueryData(['user'], data);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
      
      toast({
        title: "Success",
        description: "Account created successfully",
        variant: "default"
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
      setUser(null);
      queryClient.clear();
      localStorage.removeItem('user');
      navigate('/admin/login');
      
      toast({
        title: "Success",
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Logout failed",
        variant: "destructive"
      });
    }
  };

  const googleSignIn = async (credential: string) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
      });

      if (!res.ok) {
        throw new Error('Google sign-in failed');
      }

      const user = await res.json();
      setUser(user);
      queryClient.setQueryData(['user'], user);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
      
      toast({
        title: "Success",
        description: "Logged in with Google successfully",
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Google sign-in failed",
        variant: "destructive"
      });
    }
  };

  const adminLogin = useMutation<User, Error, { secretKey: string }>({
    mutationFn: async ({ secretKey }) => {
      console.log('Attempting admin login with secret key:', secretKey);
      
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secretKey }),
        credentials: 'include',
      });

      const data = await res.json();
      console.log('Login response:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Admin login failed');
      }

      if (data.role !== 'admin') {
        throw new Error('Invalid admin credentials');
      }

      return data;
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.setQueryData(['user'], data);
      localStorage.setItem('user', JSON.stringify(data));
      
      toast({
        title: "Success",
        description: "Admin login successful",
        variant: "default"
      });

      navigate('/admin/dashboard', { replace: true });
    },
    onError: (error) => {
      console.error('Admin login error:', error);
      toast({
        title: "Error",
        description: error.message || "Admin login failed",
        variant: "destructive"
      });
    }
  });

  return (
    <AuthContext.Provider value={{
      user: user ?? null,
      isLoading,
      error: null,
      login,
      signup,
      logout,
      googleSignIn,
      isAdmin: user?.role === 'admin',
      adminLogin
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
  return context;
}