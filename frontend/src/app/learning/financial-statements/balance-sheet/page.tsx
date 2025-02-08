"use client";

import React, { useState } from "react";
import Link from "next/link";

interface BalanceItem {
  id: string;
  type: 'asset' | 'liability' | 'equity';
  description: string;
  amount: number;
  category: string;
}

interface GameState {
  assets: number;
  liabilities: number;
  equity: number;
  score: number;
  level: number;
  feedback: string;
}

const BalanceSheetGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    assets: 0,
    liabilities: 0,
    equity: 0,
    score: 0,
    level: 1,
    feedback: ""
  });

  const [availableItems, setAvailableItems] = useState<BalanceItem[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<BalanceItem[]>([]);
  const [selectedLiabilities, setSelectedLiabilities] = useState<BalanceItem[]>([]);
  const [selectedEquity, setSelectedEquity] = useState<BalanceItem[]>([]);
  const [showHint, setShowHint] = useState(false);

  const levels = [
    {
      name: "Tech Startup",
      target: 100000,
      items: [
        // Assets
        { id: "1", type: "asset", category: "Current Assets", description: "Cash", amount: 50000 },
        { id: "2", type: "asset", category: "Current Assets", description: "Accounts Receivable", amount: 25000 },
        { id: "3", type: "asset", category: "Fixed Assets", description: "Equipment", amount: 75000 },
        { id: "4", type: "asset", category: "Fixed Assets", description: "Office Furniture", amount: 15000 },
        
        // Liabilities
        { id: "5", type: "liability", category: "Current Liabilities", description: "Accounts Payable", amount: 20000 },
        { id: "6", type: "liability", category: "Long-term Liabilities", description: "Bank Loan", amount: 45000 },
        
        // Equity
        { id: "7", type: "equity", category: "Owner's Equity", description: "Initial Investment", amount: 80000 },
        { id: "8", type: "equity", category: "Owner's Equity", description: "Retained Earnings", amount: 20000 },
      ]
    }
  ];

  const startGame = () => {
    setGameStarted(true);
    setAvailableItems(levels[0].items);
  };

  const handleItemSelect = (item: BalanceItem, targetSection: 'assets' | 'liabilities' | 'equity') => {
    const newState = { ...gameState };
    
    // Remove item from available items
    setAvailableItems(prev => prev.filter(i => i.id !== item.id));

    // Add item to appropriate section
    switch (targetSection) {
      case 'assets':
        setSelectedAssets(prev => [...prev, item]);
        newState.assets += item.amount;
        break;
      case 'liabilities':
        setSelectedLiabilities(prev => [...prev, item]);
        newState.liabilities += item.amount;
        break;
      case 'equity':
        setSelectedEquity(prev => [...prev, item]);
        newState.equity += item.amount;
        break;
    }

    // Check if equation balances
    if (newState.assets === (newState.liabilities + newState.equity) && newState.assets > 0) {
      newState.feedback = "Perfect! Your balance sheet is balanced!";
      newState.score += 100;
    } else if (newState.assets > (newState.liabilities + newState.equity)) {
      newState.feedback = "Assets are greater than Liabilities + Equity";
    } else if (newState.assets < (newState.liabilities + newState.equity)) {
      newState.feedback = "Assets are less than Liabilities + Equity";
    }

    setGameState(newState);
  };

  const resetLevel = () => {
    setSelectedAssets([]);
    setSelectedLiabilities([]);
    setSelectedEquity([]);
    setAvailableItems(levels[gameState.level - 1].items);
    setGameState({
      ...gameState,
      assets: 0,
      liabilities: 0,
      equity: 0,
      feedback: ""
    });
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link 
          href="/learning/financial-statements" 
          className="inline-flex items-center text-[#612665] hover:underline mb-8"
        >
          <span className="mr-2">←</span>
          Back to Financial Statements
        </Link>

        {!gameStarted ? (
          <div className="text-center space-y-8">
            <h1 className="text-4xl font-bold text-[#612665] mb-6">Balance Sheet Builder</h1>
            <div className="bg-white rounded-xl p-8 border-2 border-[#F3F0F4]">
              <h2 className="text-2xl font-bold text-[#612665] mb-4">Master the Art of Balance!</h2>
              <p className="text-[#b8a3be] mb-6">
                Build a balanced sheet by matching Assets with Liabilities and Equity.
                Remember the golden rule: Assets = Liabilities + Equity
              </p>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-[#612665] text-white rounded-lg hover:bg-[#4d1e51] transition-colors text-lg font-semibold"
              >
                Start Building
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
                  <p className="text-[#b8a3be]">Balance the sheet to proceed!</p>
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
            <div className="grid grid-cols-4 gap-6">
              {/* Available Items */}
              <div className="col-span-1 bg-white rounded-xl p-6 border-2 border-[#F3F0F4]">
                <h3 className="text-xl font-bold text-[#612665] mb-4">Available Items</h3>
                <div className="space-y-3">
                  {availableItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemSelect(item, item.type)}
                      className="w-full p-4 rounded-lg border-2 border-[#F3F0F4] hover:border-[#612665] transition-all"
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-[#612665] font-semibold">{item.description}</span>
                        <span className="text-[#b8a3be] text-sm">${item.amount}</span>
                        <span className="text-[#b8a3be] text-xs">{item.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Balance Sheet */}
              <div className="col-span-3 grid grid-cols-3 gap-6">
                {/* Assets */}
                <div className="bg-white rounded-xl p-6 border-2 border-[#F3F0F4]">
                  <h3 className="text-xl font-bold text-[#612665] mb-4">Assets</h3>
                  <div className="space-y-4">
                    {selectedAssets.map((asset) => (
                      <div key={asset.id} className="p-3 bg-[#F3F0F4] rounded-lg">
                        <div className="font-semibold text-[#612665]">{asset.description}</div>
                        <div className="text-[#b8a3be]">${asset.amount}</div>
                      </div>
                    ))}
                    <div className="pt-4 border-t-2 border-[#F3F0F4]">
                      <div className="font-bold text-[#612665]">Total Assets</div>
                      <div className="text-xl font-bold text-[#612665]">${gameState.assets}</div>
                    </div>
                  </div>
                </div>

                {/* Liabilities */}
                <div className="bg-white rounded-xl p-6 border-2 border-[#F3F0F4]">
                  <h3 className="text-xl font-bold text-[#612665] mb-4">Liabilities</h3>
                  <div className="space-y-4">
                    {selectedLiabilities.map((liability) => (
                      <div key={liability.id} className="p-3 bg-[#F3F0F4] rounded-lg">
                        <div className="font-semibold text-[#612665]">{liability.description}</div>
                        <div className="text-[#b8a3be]">${liability.amount}</div>
                      </div>
                    ))}
                    <div className="pt-4 border-t-2 border-[#F3F0F4]">
                      <div className="font-bold text-[#612665]">Total Liabilities</div>
                      <div className="text-xl font-bold text-[#612665]">${gameState.liabilities}</div>
                    </div>
                  </div>
                </div>

                {/* Equity */}
                <div className="bg-white rounded-xl p-6 border-2 border-[#F3F0F4]">
                  <h3 className="text-xl font-bold text-[#612665] mb-4">Equity</h3>
                  <div className="space-y-4">
                    {selectedEquity.map((equity) => (
                      <div key={equity.id} className="p-3 bg-[#F3F0F4] rounded-lg">
                        <div className="font-semibold text-[#612665]">{equity.description}</div>
                        <div className="text-[#b8a3be]">${equity.amount}</div>
                      </div>
                    ))}
                    <div className="pt-4 border-t-2 border-[#F3F0F4]">
                      <div className="font-bold text-[#612665]">Total Equity</div>
                      <div className="text-xl font-bold text-[#612665]">${gameState.equity}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Equation Display */}
            <div className="bg-[#F3F0F4] rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-[#612665] flex items-center justify-center space-x-4">
                <span>${gameState.assets}</span>
                <span>=</span>
                <span>${gameState.liabilities}</span>
                <span>+</span>
                <span>${gameState.equity}</span>
              </div>
              <div className="text-[#b8a3be] mt-2">Assets = Liabilities + Equity</div>
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
                  Start by identifying what the company owns (Assets). Then match it with how those assets were financed,
                  either through Liabilities (what we owe) or Equity (owner's investment and earnings).
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BalanceSheetGame; 