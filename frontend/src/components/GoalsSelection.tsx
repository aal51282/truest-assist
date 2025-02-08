import React from 'react';
import Image from 'next/image';

interface Goal {
  id: string;
  text: string;
}

interface GoalsSelectionProps {
  selectedGoals: string[];
  onGoalToggle: (goalId: string) => void;
}

const GOALS: Goal[] = [
  { id: 'grow_business', text: 'Grow my small business' },
  { id: 'learn_invest', text: 'Learn how to invest' },
  { id: 'business_finance', text: 'Learn more about business finance' },
  { id: 'taxes', text: 'Understand taxes & deductions' },
  { id: 'financial_success', text: 'Plan for long-term financial success' },
  { id: 'cash_flow', text: 'Master cash flow management' },
];

const GoalsSelection = ({ selectedGoals, onGoalToggle }: GoalsSelectionProps) => {
  return (
    <div className="space-y-8">
      <div className="relative">
        {/* Background rectangle */}
        <div className="bg-[#F3F0F4] rounded-lg p-8 pt-16 mb-8">
          {/* Avatar circle positioned above the rectangle */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <div className="w-24 h-24 rounded-full bg-[#F3F0F4] flex items-center justify-center">
              <Image
                src="/woman.png"
                alt="Avatar"
                width={96}
                height={96}
                className="rounded-full"
                priority
              />
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-semibold text-[#612665]">Welcome, User!</h2>
            <p className="text-xl text-[#b8a3be]">
              What do you want to achieve with Truest Assist today?
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {GOALS.map((goal) => (
          <div
            key={goal.id}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#F3F0F4] transition-colors cursor-pointer"
            onClick={() => onGoalToggle(goal.id)}
          >
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center
              ${selectedGoals.includes(goal.id)
                ? 'border-[#612665] bg-[#612665] text-white'
                : 'border-[#612665]'
              }`}
            >
              {selectedGoals.includes(goal.id) && (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </div>
            <span className="text-lg text-[#612665]">{goal.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalsSelection; 