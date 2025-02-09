"use client";

import React, { useState } from "react";
import Logo from "@/components/Logo";
import Input from "@/components/Input";
import Link from "next/link";
import GoalsSelection from "@/components/GoalsSelection";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignUp() {
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setIsLoggedIn, setUser } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId]
    );
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!validateForm()) return;
      setStep(2);
      return;
    }

    // Step 2 submission (final)
    setError('');
    setIsLoading(true);

    try {
      // Create the user
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
        credentials: 'include',
      });

      const data = await signupResponse.json();

      if (!signupResponse.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Update auth context
      setIsLoggedIn(true);
      if (data.data) {
        const userData = {
          id: data.data.id,
          username: data.data.username,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }

      // Redirect to learning path
      router.push('/learning-path');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      setStep(1); // Go back to first step if there's an error
    } finally {
      setIsLoading(false);
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
                <h1 className="text-3xl font-bold text-[#612665] mb-2">
                  Create Your Account
                </h1>
                <p className="text-[#b8a3be]">
                  Start your journey to financial mastery
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

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
                  label="Username"
                  type="text"
                  name="username"
                  required
                  autoComplete="username"
                  value={formData.username}
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
                    I agree to the{" "}
                    <a href="#" className="text-[#612665] hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[#612665] hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-[#612665] text-white rounded-lg hover:bg-[#4d1e51] transition-colors text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#612665] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Continue'}
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <GoalsSelection
                selectedGoals={selectedGoals}
                onGoalToggle={handleGoalToggle}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#612665] text-white rounded-lg hover:bg-[#4d1e51] transition-colors text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#612665] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          {step === 1 && (
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#612665] font-semibold hover:underline"
                >
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
