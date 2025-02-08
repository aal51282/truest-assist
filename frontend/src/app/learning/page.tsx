"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const LearningPage = () => {
  return (
    <div className="min-h-screen bg-white p-8 max-w-2xl mx-auto">
      {/* Header and Welcome */}
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
        <h1 className="text-4xl font-bold text-[#612665] mb-4">Learning Modules</h1>
        <p className="text-xl text-[#b8a3be]">Select a module to begin your learning journey</p>
      </div>

      {/* Learning Modules */}
      <div className="space-y-6">
        <Link href="/learning/balance-sheet" className="block group">
          <div className="p-8 border-2 border-[#F3F0F4] rounded-xl hover:border-[#612665] hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer bg-white">
            <div className="flex items-start space-x-6">
              <div className="text-4xl bg-[#F3F0F4] w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-[#612665] group-hover:text-white transition-colors">
                📊
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#612665] mb-2">Balance Sheet Analysis</h2>
                <p className="text-[#b8a3be]">
                  Learn to analyze balance sheets and understand key financial ratios
                </p>
                <div className="mt-4 flex items-center text-sm text-[#612665]">
                  <span className="mr-4">🕒 30 mins</span>
                  <span>⭐ Beginner Friendly</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/learning/ebitda" className="block group">
          <div className="p-8 border-2 border-[#F3F0F4] rounded-xl hover:border-[#612665] hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer bg-white">
            <div className="flex items-start space-x-6">
              <div className="text-4xl bg-[#F3F0F4] w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-[#612665] group-hover:text-white transition-colors">
                💡
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#612665] mb-2">EBITDA Calculation</h2>
                <p className="text-[#b8a3be]">
                  Master the calculation and interpretation of EBITDA metrics
                </p>
                <div className="mt-4 flex items-center text-sm text-[#612665]">
                  <span className="mr-4">🕒 45 mins</span>
                  <span>🎯 Intermediate</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/learning/horizontal-analysis" className="block group">
          <div className="p-8 border-2 border-[#F3F0F4] rounded-xl hover:border-[#612665] hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer bg-white">
            <div className="flex items-start space-x-6">
              <div className="text-4xl bg-[#F3F0F4] w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-[#612665] group-hover:text-white transition-colors">
                📈
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#612665] mb-2">Horizontal Analysis</h2>
                <p className="text-[#b8a3be]">
                  Compare financial metrics across time periods and identify key trends
                </p>
                <div className="mt-4 flex items-center text-sm text-[#612665]">
                  <span className="mr-4">🕒 60 mins</span>
                  <span>🌟 Advanced</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LearningPage;