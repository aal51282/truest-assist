'use client';

import React from 'react';
import Logo from '@/components/Logo';
import Input from '@/components/Input';
import Link from 'next/link';

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

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
            <Input
              label="User ID"
              type="text"
              name="userId"
              required
              autoComplete="username"
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              required
              autoComplete="current-password"
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
              className="w-full py-3 px-4 bg-[#612665] text-white rounded-lg hover:bg-[#4d1e51] transition-colors text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#612665] focus:ring-offset-2"
            >
              Login
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