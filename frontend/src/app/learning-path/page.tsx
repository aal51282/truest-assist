"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

const LearningPathPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white p-8 max-w-2xl mx-auto">
        {/* Avatar and Welcome */}
        <div className="flex flex-col items-center mb-16">
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
        <div className="space-y-12 px-4">
          <Link href="/learning" className="block group">
            <div className="p-10 border-2 border-[#F3F0F4] rounded-xl hover:border-[#612665] hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer bg-white">
              <div className="flex items-start space-x-8">
                <div className="text-4xl bg-[#F3F0F4] w-20 h-20 rounded-xl flex items-center justify-center group-hover:bg-[#612665] group-hover:text-white transition-colors">
                  📚
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#612665] mb-3">Learning</h2>
                  <p className="text-[#b8a3be] text-lg">
                    Interactive exercises to master financial concepts through guided learning modules
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/analysis" className="block group">
            <div className="p-10 border-2 border-[#F3F0F4] rounded-xl hover:border-[#612665] hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer bg-white">
              <div className="flex items-start space-x-8">
                <div className="text-4xl bg-[#F3F0F4] w-20 h-20 rounded-xl flex items-center justify-center group-hover:bg-[#612665] group-hover:text-white transition-colors">
                  📊
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#612665] mb-3">Analysis</h2>
                  <p className="text-[#b8a3be] text-lg">
                    Apply your knowledge by analyzing real financial data and generating insights
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default LearningPathPage;
