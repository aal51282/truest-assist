'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ContentSection {
  id: string;
  title: string;
  isCompleted: boolean;
  hasGame?: boolean;
  path: string;
}

const BalanceSheetPage = () => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const contentSections: ContentSection[] = [
    { id: 'equation', title: 'Balance Sheet Equation', isCompleted: false, path: '/learning/balance-sheet/equation' },
    { id: 'cash', title: 'Cash and Accounts Receivable', isCompleted: false, path: '/learning/balance-sheet/cash-ar' },
    { id: 'inventory', title: 'Inventory', isCompleted: false, path: '/learning/balance-sheet/inventory' },
    { id: 'inventory-game', title: '(mini Game)', isCompleted: false, hasGame: true, path: '/learning/balance-sheet/inventory-game' },
    { id: 'prepaid', title: 'Prepaid Expenses', isCompleted: false, path: '/learning/balance-sheet/prepaid' },
    { id: 'ppe', title: 'Property, Plant, and Equipment', isCompleted: false, path: '/learning/balance-sheet/ppe' },
    { id: 'ppe-game', title: '(mini Game)', isCompleted: false, hasGame: true, path: '/learning/balance-sheet/ppe-game' },
    { id: 'ap', title: 'Accounts Payable', isCompleted: false, path: '/learning/balance-sheet/accounts-payable' },
    { id: 'liabilities', title: 'Liabilities', isCompleted: false, path: '/learning/balance-sheet/liabilities' },
    { id: 'deferred', title: 'Deferred Revenue', isCompleted: false, path: '/learning/balance-sheet/deferred-revenue' },
    { id: 'longterm', title: 'Long-Term Debt', isCompleted: false, path: '/learning/balance-sheet/long-term-debt' },
    { id: 'debt-game', title: '(mini Game)', isCompleted: false, hasGame: true, path: '/learning/balance-sheet/debt-game' },
    { id: 'assets', title: 'Assets & Liabilities', isCompleted: false, path: '/learning/balance-sheet/assets-liabilities' },
    { id: 'equity', title: 'Common Stack and Retained Earnings', isCompleted: false, path: '/learning/balance-sheet/equity' },
    { id: 'quiz', title: 'Quiz 1', isCompleted: false, hasGame: true, path: '/learning/balance-sheet/quiz' },
  ];

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Back Button */}
      <Link 
        href="/learning" 
        className="inline-flex items-center text-[#612665] hover:underline mb-8"
      >
        <span className="mr-2">←</span>
        Back to Learning
      </Link>

      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-bold text-[#612665] mb-6">Balance Sheet Analysis</h1>

        {/* Video Section */}
        <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://www.youtube.com/embed/Sx2R6qS8ZJw"
              title="Balance Sheet Basics"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-[#612665] mb-2">
            <span>Progress</span>
            <span>{Math.round((completedSections.length / contentSections.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-[#F3F0F4] rounded-full">
            <div 
              className="h-full bg-[#612665] rounded-full transition-all duration-300"
              style={{ width: `${(completedSections.length / contentSections.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-4">
          {contentSections.map((section) => (
            <Link key={section.id} href={section.path}>
              <div 
                className={`p-6 border-2 ${
                  completedSections.includes(section.id)
                    ? 'border-[#612665] bg-[#F3F0F4]'
                    : 'border-[#F3F0F4]'
                } rounded-xl hover:border-[#612665] hover:shadow-lg transition-all cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Status Icon */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center
                      ${completedSections.includes(section.id)
                        ? 'bg-[#612665] text-white'
                        : 'border-2 border-[#612665]'
                      }`}
                    >
                      {completedSections.includes(section.id) && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-[#612665]">
                      {section.title}
                    </h3>
                  </div>

                  {/* Game Badge */}
                  {section.hasGame && (
                    <span className="px-3 py-1 text-sm bg-[#612665] text-white rounded-full">
                      Interactive
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BalanceSheetPage; 