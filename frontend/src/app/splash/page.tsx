'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

const SplashPage = () => {
  return (
    <div className="min-h-screen bg-white p-6">
      {/* Navigation */}
      <nav className="flex justify-between items-center mb-20">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="text-[#612665] hover:underline px-4 py-2"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-[#612665] text-white px-6 py-2 rounded-lg hover:bg-[#4d1e51] transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-[#612665] mb-6">
          Transform Your Financial
          <br />
          Analysis Experience
        </h1>
        
        <p className="text-xl text-[#b8a3be] mb-16">
          Organize, analyze, and elevate your understanding with AI-powered
          <br />
          financial management and learning
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 rounded-lg border-2 border-[#F3F0F4] hover:border-[#612665] transition-colors">
            <div className="text-[#612665] text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-[#612665] mb-3">Balance Sheet Analysis</h3>
            <p className="text-[#b8a3be]">Master financial statements through interactive learning and AI-powered insights</p>
          </div>

          <div className="p-8 rounded-lg border-2 border-[#F3F0F4] hover:border-[#612665] transition-colors">
            <div className="text-[#612665] text-4xl mb-4">💡</div>
            <h3 className="text-xl font-semibold text-[#612665] mb-3">EBITDA Calculation</h3>
            <p className="text-[#b8a3be]">Get personalized guidance on financial metrics and calculations</p>
          </div>

          <div className="p-8 rounded-lg border-2 border-[#F3F0F4] hover:border-[#612665] transition-colors">
            <div className="text-[#612665] text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-[#612665] mb-3">Performance Tracking</h3>
            <p className="text-[#b8a3be]">Understand trends and optimize your financial analysis skills</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4">
          <Link
            href="/signup"
            className="bg-[#612665] text-white px-8 py-4 rounded-lg hover:bg-[#4d1e51] transition-colors text-lg font-semibold"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="border-2 border-[#612665] text-[#612665] px-8 py-4 rounded-lg hover:bg-[#F3F0F4] transition-colors text-lg font-semibold"
          >
            Login
          </Link>
        </div>
      </main>
    </div>
  );
};

export default SplashPage; 