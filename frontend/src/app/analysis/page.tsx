"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import ProtectedRoute from "@/components/ProtectedRoute";

const AnalysisPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Section - File Upload */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-[#612665] mb-8">
                Financial Analysis
              </h1>
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl text-[#612665] mb-4">
                  Upload Your Financial Statement
                </h2>
                <div className="relative">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <button className="bg-[#612665] text-white px-6 py-2 rounded-full hover:bg-[#4d1e51] transition-colors">
                        Choose File
                      </button>
                      <span className="text-gray-500">
                        {fileName || 'No file selected'}
                      </span>
                    </div>
                  </label>
                </div>
                {selectedFile && (
                  <button
                    className="mt-8 w-full bg-[#612665] text-white py-3 rounded-lg hover:bg-[#4d1e51] transition-colors"
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>

            {/* Right Section - Comparative Analysis */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#612665] mb-6">
                Comparative Analysis
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {/* Balance Sheet Section */}
                <div>
                  <h3 className="text-lg font-semibold text-[#612665] mb-4">
                    Your Balance Sheet
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Image
                      src="/balance-sheet-example.png"
                      alt="Balance Sheet"
                      width={300}
                      height={400}
                      className="w-full object-contain"
                    />
                  </div>
                </div>

                {/* Company Analysis Section */}
                <div>
                  <h3 className="text-lg font-semibold text-[#612665] mb-4">
                    Company Analysis
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Image
                      src="/company-analysis.png"
                      alt="Company Analysis"
                      width={300}
                      height={400}
                      className="w-full object-contain"
                    />
                  </div>
                </div>

                {/* Advice Section */}
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold text-[#612665] mb-4">
                    Advice
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-[#612665]">Asset Utilization & Liquidity</h4>
                      <p className="text-gray-600">Personal Finance: Keep a balance between liquid assets (cash, savings) and investments for long-term growth.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#612665]">Investment Growth & Diversification</h4>
                      <p className="text-gray-600">Personal Finance: Consider diversifying your portfolio (investments, side businesses) to increase financial stability.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#612665]">Long-Term vs. Short-Term Planning</h4>
                      <p className="text-gray-600">Personal Finance: Plan for long-term financial goals while managing short-term needs.</p>
                    </div>
                  </div>
                </div>

                {/* Current Practices Section */}
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold text-[#612665] mb-4">
                    Current Practices
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Walmart manages inventory efficiently by minimizing excess stock while ensuring products are available when needed.
                    </p>
                    <p className="text-gray-600">
                      Expands revenue through e-commerce, retail locations, and credit cards.
                    </p>
                    <p className="text-gray-600">
                      Walmart balances short-term operational efficiency with long-term strategic investments in technology and sustainability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AnalysisPage; 