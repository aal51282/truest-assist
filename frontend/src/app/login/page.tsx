'use client';

import React, { useState, useEffect } from 'react';
import Logo from '@/components/Logo';
import Input from '@/components/Input';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsLoggedIn, setUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Update auth context
      setIsLoggedIn(true);
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Get the redirect URL from search params or default to learning path
      const redirectPath = searchParams?.get('redirect');
      router.push(redirectPath || '/learning-path');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already logged in, redirect to learning path
  useEffect(() => {
    const token = document.cookie.includes('token=');
    if (token) {
      router.push('/learning-path');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <Link href="/splash" className="flex items-center">
          <Logo />
        </Link>
        <div className="flex gap-4">
          <Link
            href="/signup"
            className="bg-[#612665] text-white px-6 py-2 rounded-lg hover:bg-[#4d1e51] transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#612665] mb-2">Welcome Back!</h1>
            <p className="text-[#b8a3be]">Log in to continue your financial journey</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <Input
              label="Email"
              type="email"
              name="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
            />
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-purple-300 text-[#612665] focus:ring-[#612665]"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Remember me?
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#612665] text-white rounded-lg hover:bg-[#4d1e51] transition-colors text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#612665] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/forgot-password" className="text-sm text-[#612665] hover:underline">
              Forgot Password?
            </Link>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Need an account?{' '}
              <Link href="/signup" className="text-[#612665] font-semibold hover:underline">
                SIGN UP
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 