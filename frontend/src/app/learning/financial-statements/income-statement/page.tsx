"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface TransactionItem {
  id: string;
  type: 'revenue' | 'cogs' | 'expense';
  description: string;
  amount: number;
}

interface GameState {
  revenue: number;
  cogs: number;
  expenses: number;
  score: number;
  level: number;
  feedback: string;
}

const IncomeStatementGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    revenue: 0,
    cogs: 0,
    expenses: 0,
    score: 0,
    level: 1,
    feedback: ""
  });

  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<TransactionItem[]>([]);
  const [showHint, setShowHint] = useState(false);

  // Game levels data
  const levels = [
    {
      name: "Coffee Shop",
      target: 5000,
      transactions: [
        { id: "1", type: "revenue", description: "Coffee Sales", amount: 8000 },
        { id: "2", type: "revenue", description: "Pastry Sales", amount: 3000 },
        { id: "3", type: "cogs", description: "Coffee Beans", amount: 2000 },
        { id: "4", type: "cogs", description: "Milk & Supplies", amount: 1000 },
        { id: "5", type: "expense", description: "Rent", amount: 1500 },
        { id: "6", type: "expense", description: "Staff Wages", amount: 1500 },
      ]
    },
    // Add more levels here
  ];

  const startGame = () => {
    setGameStarted(true);
    setTransactions(levels[0].transactions);
  };

  const handleItemSelect = (item: TransactionItem) => {
    setSelectedItems([...selectedItems, item]);
    setTransactions(transactions.filter(t => t.id !== item.id));

    // Update game state based on item type
    const newState = { ...gameState };
    switch (item.type) {
      case 'revenue':
        newState.revenue += item.amount;
        break;
      case 'cogs':
        newState.cogs += item.amount;
        break;
      case 'expense':
        newState.expenses += item.amount;
        break;
    }

    // Calculate current profit
    const grossProfit = newState.revenue - newState.cogs;
    const netIncome = grossProfit - newState.expenses;

    // Update feedback
    if (netIncome === levels[gameState.level - 1].target) {
      newState.feedback = "Perfect! You've hit the target!";
      newState.score += 100;
    } else if (netIncome > levels[gameState.level - 1].target) {
      newState.feedback = "Getting closer! But your profit is too high.";
    } else {
      newState.feedback = "Keep going! Your profit is too low.";
    }

    setGameState(newState);
  };

  const resetLevel = () => {
    setSelectedItems([]);
    setTransactions(levels[gameState.level - 1].transactions);
    setGameState({
      ...gameState,
      revenue: 0,
      cogs: 0,
      expenses: 0,
      feedback: ""
    });
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/learning/financial-statements" 
          className="inline-flex items-center text-[#612665] hover:underline mb-8"
        >
          <span className="mr-2">←</span>
          Back to Financial Statements
        </Link>

        {!gameStarted ? (
          <div className="text-center space-y-8">
            <h1 className="text-4xl font-bold text-[#612665] mb-6">Income Statement Challenge</h1>
            <div className="bg-white rounded-xl p-8 border-2 border-[#F3F0F4]">
              <h2 className="text-2xl font-bold text-[#612665] mb-4">Welcome to the Business Simulator!</h2>
              <p className="text-[#b8a3be] mb-6">
                Help different businesses achieve their profit targets by building their income statements.
                Drag and drop revenue and expenses to see how they affect the bottom line!
              </p>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-[#612665] text-white rounded-lg hover:bg-[#4d1e51] transition-colors text-lg font-semibold"
              >
                Start Game
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Game Header */}
            <div className="bg-white rounded-xl p-6 border-2 border-[#F3F0F4]">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-[#612665]">Level {gameState.level}: {levels[gameState.level - 1].name}</h2>
                  <p className="text-[#b8a3be]">Target Profit: ${levels[gameState.level - 1].target}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#612665]">Score: {gameState.score}</div>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-[#612665] hover:underline"
                  >
                    Need a Hint?
                  </button>
                </div>
              </div>
            </div>

            {/* Game Board */}
            <div className="grid grid-cols-2 gap-6">
              {/* Available Items */}
              <div className="bg-white rounded-xl p-6 border-2 border-[#F3F0F4]">
                <h3 className="text-xl font-bold text-[#612665] mb-4">Available Items</h3>
                <div className="space-y-3">
                  {transactions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemSelect(item)}
                      className="w-full p-4 rounded-lg border-2 border-[#F3F0F4] hover:border-[#612665] transition-all flex justify-between items-center"
                    >
                      <span className="text-[#612665]">{item.description}</span>
                      <span className="text-[#b8a3be]">${item.amount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Income Statement */}
              <div className="bg-white rounded-xl p-6 border-2 border-[#F3F0F4]">
                <h3 className="text-xl font-bold text-[#612665] mb-4">Your Income Statement</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-[#612665]">Revenue</h4>
                    <div className="text-[#b8a3be]">${gameState.revenue}</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#612665]">Cost of Goods Sold</h4>
                    <div className="text-[#b8a3be]">${gameState.cogs}</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#612665]">Gross Profit</h4>
                    <div className="text-[#b8a3be]">${gameState.revenue - gameState.cogs}</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#612665]">Operating Expenses</h4>
                    <div className="text-[#b8a3be]">${gameState.expenses}</div>
                  </div>
                  <div className="pt-4 border-t-2 border-[#F3F0F4]">
                    <h4 className="font-bold text-[#612665]">Net Income</h4>
                    <div className="text-2xl font-bold text-[#612665]">
                      ${gameState.revenue - gameState.cogs - gameState.expenses}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Area */}
            <div className="bg-white rounded-xl p-6 border-2 border-[#F3F0F4] text-center">
              <p className="text-xl text-[#612665]">{gameState.feedback}</p>
              <div className="mt-4 space-x-4">
                <button
                  onClick={resetLevel}
                  className="px-6 py-3 border-2 border-[#612665] text-[#612665] rounded-lg hover:bg-[#F3F0F4] transition-colors"
                >
                  Reset Level
                </button>
              </div>
            </div>

            {/* Hint Panel */}
            {showHint && (
              <div className="bg-[#F3F0F4] rounded-xl p-6">
                <h3 className="font-bold text-[#612665] mb-2">Hint</h3>
                <p className="text-[#b8a3be]">
                  Try to balance your revenue and costs to hit the target profit.
                  Remember: Net Income = Revenue - COGS - Operating Expenses
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeStatementGame; 