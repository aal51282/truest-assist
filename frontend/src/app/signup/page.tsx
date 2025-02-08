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
    <main className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-8">
        {step === 1 ? (
          <>
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
              <Link href="/" className="text-[#612665] font-semibold hover:underline">
                LOGIN
              </Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
} 