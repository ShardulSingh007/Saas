import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "@/components/ui/use-toast";

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const user = await response.json();
      await login(email, password);
      toast({
        title: "Success",
        description: "Your account has been created successfully.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-black">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md bg-[#18181b] rounded-2xl shadow-lg p-8 flex flex-col items-center">
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-1">Create an account</h1>
            <p className="text-base text-gray-400">Enter your details below to create your account</p>
          </div>
          <button className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-2 rounded-lg mb-4 hover:bg-gray-200 transition">
            <svg className="h-5 w-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C34.2 5.1 29.4 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z"/><path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.3 16.1 18.7 13 24 13c2.7 0 5.2.9 7.2 2.4l6.4-6.4C34.2 5.1 29.4 3 24 3 15.7 3 8.4 8.2 6.3 14.7z"/><path fill="#FBBC05" d="M24 43c5.4 0 10-1.8 13.3-4.9l-6.2-5.1C29.7 34.9 27 36 24 36c-5.7 0-10.5-3.7-12.2-8.8l-6.5 5C8.3 39.8 15.5 43 24 43z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7C34.7 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C34.2 5.1 29.4 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z"/></g></svg>
            Sign up with Google
          </button>
          <div className="flex items-center w-full my-4">
            <div className="flex-grow h-px bg-gray-700" />
            <span className="mx-3 text-gray-400 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-700" />
          </div>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <Label htmlFor="name" className="text-gray-300">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                type="text"
                autoCapitalize="none"
                autoComplete="name"
                autoCorrect="off"
                disabled={isLoading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#232326] text-white border-gray-700 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#232326] text-white border-gray-700 focus:border-blue-500"
              />
            </div>
            <div className="mb-6">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#232326] text-white border-gray-700 focus:border-blue-500"
              />
            </div>
            <Button disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
              {isLoading && (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
              Create Account
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
      <footer className="w-full py-4 bg-black text-center text-gray-500 text-sm border-t border-gray-800">
        &copy; {new Date().getFullYear()} FinancePilot. All rights reserved.
      </footer>
    </div>
  );
}
