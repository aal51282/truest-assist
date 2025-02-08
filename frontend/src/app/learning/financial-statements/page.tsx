"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Section {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  points: number;
}

const FinancialStatementsPage = () => {
  const [sections, setSections] = useState<Section[]>([
    {
      id: "income-statement",
      title: "Income Statement",
      description: "Learn about revenue, expenses, and how to calculate net income",
      isCompleted: false,
      points: 100,
    },
    {
      id: "balance-sheet",
      title: "Balance Sheet",
      description: "Understand assets, liabilities, and shareholders' equity",
      isCompleted: false,
      points: 100,
    },
    {
      id: "cash-flow",
      title: "Cash Flow Statement",
      description: "Track the flow of cash through operating, investing, and financing activities",
      isCompleted: false,
      points: 100,
    },
  ]);

  const totalPoints = sections.reduce((acc, section) => acc + (section.isCompleted ? section.points : 0), 0);
  const totalPossiblePoints = sections.reduce((acc, section) => acc + section.points, 0);
  const progress = (sections.filter(section => section.isCompleted).length / sections.length) * 100;

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/learning" 
          className="inline-flex items-center text-[#612665] hover:underline mb-8"
        >
          <span className="mr-2">←</span>
          Back to Learning Modules
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#612665] mb-2">Financial Statements</h1>
            <p className="text-xl text-[#b8a3be]">Master the fundamentals of financial reporting</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#612665] mb-1">{totalPoints} / {totalPossiblePoints}</div>
            <div className="text-[#b8a3be]">Points Earned</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-[#F3F0F4] rounded-full mb-12">
          <div 
            className="h-full bg-[#612665] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Learning Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <Link href={`/learning/financial-statements/${section.id}`} key={section.id} className="block group">
              <div className="p-8 border-2 border-[#F3F0F4] rounded-xl hover:border-[#612665] hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-6">
                    <div className={`text-4xl w-16 h-16 rounded-xl flex items-center justify-center transition-colors
                      ${section.isCompleted 
                        ? 'bg-[#612665] text-white' 
                        : 'bg-[#F3F0F4] group-hover:bg-[#612665] group-hover:text-white'}`}
                    >
                      {section.isCompleted ? '✓' : '📝'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#612665] mb-2">{section.title}</h2>
                      <p className="text-[#b8a3be]">{section.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#612665]">{section.points} pts</div>
                    <div className="text-sm text-[#b8a3be]">
                      {section.isCompleted ? 'Completed' : 'Not Started'}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Resources Section */}
        <div className="mt-12 p-8 border-2 border-[#F3F0F4] rounded-xl">
          <h2 className="text-2xl font-bold text-[#612665] mb-4">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#F3F0F4] rounded-lg">
              <h3 className="text-lg font-bold text-[#612665] mb-2">📚 Study Materials</h3>
              <p className="text-[#b8a3be] mb-4">Download comprehensive guides and templates</p>
              <button className="text-[#612665] font-semibold hover:underline">
                Access Materials →
              </button>
            </div>
            <div className="p-6 bg-[#F3F0F4] rounded-lg">
              <h3 className="text-lg font-bold text-[#612665] mb-2">🎯 Practice Exercises</h3>
              <p className="text-[#b8a3be] mb-4">Test your knowledge with interactive exercises</p>
              <button className="text-[#612665] font-semibold hover:underline">
                Start Practice →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialStatementsPage; 