'use client';

import React from 'react';
import Logo from '@/components/Logo';
import Input from '@/components/Input';
import Link from 'next/link';

export default function SignUp() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center mb-12">
          <Logo />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              name="firstName"
              required
              autoComplete="given-name"
            />
            
            <Input
              label="Last Name"
              type="text"
              name="lastName"
              required
              autoComplete="family-name"
            />
          </div>

          <Input
            label="Email"
            type="email"
            name="email"
            required
            autoComplete="email"
          />
          
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
            autoComplete="new-password"
          />
          
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            required
            autoComplete="new-password"
          />
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              required
              className="h-4 w-4 rounded border-purple-300 text-[#612665] focus:ring-[#612665]"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I agree to the{' '}
              <a href="#" className="text-[#612665] hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-[#612665] hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#612665] text-white rounded-lg hover:bg-[#4d1e51] transition-colors text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#612665] focus:ring-offset-2"
          >
            Create Account
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/" className="text-[#612665] font-semibold hover:underline">
              LOGIN
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
} 