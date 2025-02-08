'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const LearningPathPage = () => {
  return (
    <div className="min-h-screen bg-white p-8 max-w-2xl mx-auto">
      {/* Avatar and Welcome */}
      <div className="flex flex-col items-center mb-12">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-6">
          <Image
            src="/woman.png"
            alt="Profile Avatar"
            width={96}
            height={96}
            className="object-cover"
            priority
          />
        </div>
        <h1 className="text-4xl font-bold text-[#612665] mb-8">Let&apos;s Start Learning!</h1>
      </div>

      {/* Learning Options */}
      <div className="space-y-6">
        <Link href="/practice" className="block">
          <div className="p-6 border-2 border-[#F3F0F4] rounded-lg hover:border-[#612665] transition-all transform hover:scale-[1.02] cursor-pointer">
            <h2 className="text-2xl font-semibold text-[#612665]">Practice</h2>
            <p className="text-[#b8a3be] mt-2">
              Interactive exercises to master financial concepts
            </p>
          </div>
        </Link>

        <Link href="/quiz" className="block">
          <div className="p-6 border-2 border-[#F3F0F4] rounded-lg hover:border-[#612665] transition-all transform hover:scale-[1.02] cursor-pointer">
            <h2 className="text-2xl font-semibold text-[#612665]">Quiz</h2>
            <p className="text-[#b8a3be] mt-2">
              Test your knowledge and earn achievements
            </p>
          </div>
        </Link>

        <Link href="/dashboard" className="block">
          <div className="p-6 border-2 border-[#F3F0F4] rounded-lg hover:border-[#612665] transition-all transform hover:scale-[1.02] cursor-pointer">
            <h2 className="text-2xl font-semibold text-[#612665]">Dashboard</h2>
            <p className="text-[#b8a3be] mt-2">
              Analyze real financial data and generate insights
            </p>
          </div>
        </Link>
      </div>

      {/* Back to Home */}
      <div className="mt-12 text-center">
        <Link 
          href="/home" 
          className="text-[#612665] font-semibold hover:underline inline-flex items-center"
        >
          <span className="mr-2">←</span>
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default LearningPathPage; 