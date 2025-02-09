"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import ProtectedRoute from "@/components/ProtectedRoute";

const AnalysisPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setSelectedFile(file);
      setFileName(file.name);

      try {
        const content = await readFileContent(file);
        setFileContent(content);
      } catch (error) {
        console.error('Error reading file:', error);
        // You might want to show an error message to the user here
      } finally {
        setIsLoading(false);
      }
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const content = event.target?.result as string;
        resolve(content);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      if (file.type === 'application/pdf') {
        // For PDFs, we might need additional processing
        reader.readAsArrayBuffer(file);
      } else {
        // For text files, Excel, etc.
        reader.readAsText(file);
      }
    });
  };

  const handleContinue = async () => {
    if (!selectedFile || !fileContent) return;

    // Here you would typically:
    // 1. Send the file to your backend
    // 2. Process the analysis
    // 3. Update the UI with results
    console.log('Processing file:', selectedFile.name);
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
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
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
                    onClick={handleContinue}
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
                  <div className="bg-gray-50 p-4 rounded-lg min-h-[400px]">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#612665]"></div>
                      </div>
                    ) : fileContent ? (
                      <div className="whitespace-pre-wrap font-mono text-sm overflow-auto max-h-[400px]">
                        {fileContent}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        Upload a file to see its contents here
                      </div>
                    )}
                  </div>
                </div>

                {/* Company Analysis Section */}
                <div>
                  <h3 className="text-lg font-semibold text-[#612665] mb-4">
                    Company Analysis
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg min-h-[400px] relative">
                    <Image
                      src="/walmart.png"
                      alt="Walmart Balance Sheet"
                      layout="fill"
                      objectFit="contain"
                      className="rounded-lg"
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