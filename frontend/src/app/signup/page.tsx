'use client';

import React, { useState } from 'react';
import Logo from '@/components/Logo';
import Input from '@/components/Input';
import Link from 'next/link';
import GoalsSelection from '@/components/GoalsSelection';

export default function SignUp() {
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userId: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Handle final submission with both formData and selectedGoals
      console.log({ ...formData, goals: selectedGoals });
    }
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
            Login
          </Link>
        </div>
      </nav>

      <main className="flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {step === 1 ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#612665] mb-2">Create Your Account</h1>
                <p className="text-[#b8a3be]">Start your journey to financial mastery</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    type="text"
                    name="firstName"
                    required
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  
                  <Input
                    label="Last Name"
                    type="text"
                    name="lastName"
                    required
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>

                <Input
                  label="User ID"
                  type="text"
                  name="userId"
                  required
                  autoComplete="username"
                  value={formData.userId}
                  onChange={handleInputChange}
                />

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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  required
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
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
                  Continue
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <GoalsSelection
                selectedGoals={selectedGoals}
                onGoalToggle={handleGoalToggle}
              />
              
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#612665] text-white rounded-lg hover:bg-[#4d1e51] transition-colors text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#612665] focus:ring-offset-2"
              >
                Create Account
              </button>
            </form>
          )}
          
          {step === 1 && (
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-[#612665] font-semibold hover:underline">
                  LOGIN
                </Link>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 