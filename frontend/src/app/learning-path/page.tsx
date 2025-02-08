"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const LearningPathPage = () => {
  return (
    <div className="min-h-screen bg-white p-8 max-w-2xl mx-auto">
      {/* Avatar and Welcome */}
      <div className="flex flex-col items-center mb-12">
        <div className="w-32 h-32 rounded-full overflow-hidden mb-6 bg-white p-2 shadow-lg">
          <Image
            src="/woman.png"
            alt="Profile Avatar"
            width={128}
            height={128}
            className="object-cover rounded-full"
            priority
          />
        </div>
        <h1 className="text-4xl font-bold text-[#612665] mb-4">Let&apos;s Start Learning!</h1>
        <p className="text-xl text-[#b8a3be]">Choose your path to financial mastery</p>
      </div>

      {/* Learning Options */}
      <div className="space-y-6">
        <Link href="/practice" className="block group">
          <div className="p-8 border-2 border-[#F3F0F4] rounded-xl hover:border-[#612665] hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer bg-white">
            <div className="flex items-start space-x-6">
              <div className="text-4xl bg-[#F3F0F4] w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-[#612665] group-hover:text-white transition-colors">
                📚
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#612665] mb-2">Practice</h2>
                <p className="text-[#b8a3be]">
                  Interactive exercises to master financial concepts
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/quiz" className="block group">
          <div className="p-8 border-2 border-[#F3F0F4] rounded-xl hover:border-[#612665] hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer bg-white">
            <div className="flex items-start space-x-6">
              <div className="text-4xl bg-[#F3F0F4] w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-[#612665] group-hover:text-white transition-colors">
                ✍️
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#612665] mb-2">Quiz</h2>
                <p className="text-[#b8a3be]">
                  Test your knowledge and earn achievements
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/dashboard" className="block group">
          <div className="p-8 border-2 border-[#F3F0F4] rounded-xl hover:border-[#612665] hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer bg-white">
            <div className="flex items-start space-x-6">
              <div className="text-4xl bg-[#F3F0F4] w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-[#612665] group-hover:text-white transition-colors">
                📊
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#612665] mb-2">Dashboard</h2>
                <p className="text-[#b8a3be]">
                  Analyze real financial data and generate insights
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LearningPathPage;
