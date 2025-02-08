'use client';

import React, { useState } from 'react';
import Logo from '@/components/Logo';
import Input from '@/components/Input';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    setEmailSent(true);
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
            href="/login"
            className="bg-[#612665] text-white px-6 py-2 rounded-lg hover:bg-[#4d1e51] transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </nav>

      <main className="flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#612665] mb-2">Reset Your Password</h1>
            <p className="text-[#b8a3be]">
              {emailSent 
                ? "Check your email for reset instructions"
                : "Enter your email address to receive password reset instructions"
              }
            </p>
          </div>

          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="Enter your email address"
              />
              
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#612665] text-white rounded-lg hover:bg-[#4d1e51] transition-colors text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#612665] focus:ring-offset-2"
              >
                Send Reset Instructions
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-[#F3F0F4] rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">📧</div>
                <p className="text-[#612665] mb-2">Reset Email Sent!</p>
                <p className="text-[#b8a3be] text-sm">
                  Please check your email for instructions to reset your password.
                  The link will expire in 24 hours.
                </p>
              </div>
              
              <button
                onClick={() => setEmailSent(false)}
                className="w-full py-3 px-4 border-2 border-[#612665] text-[#612665] rounded-lg hover:bg-[#F3F0F4] transition-colors text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#612665] focus:ring-offset-2"
              >
                Try Different Email
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Remember your password?{' '}
              <Link href="/login" className="text-[#612665] font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 