"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
// import ProtectedRoute from "@/components/ProtectedRoute";

const AnalysisPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setError(null);
      setSelectedFile(file);
      setFileName(file.name);
      setImageUrl(null);
      setFileContent(null);

      try {
        if (file.type.startsWith("image/")) {
          const url = URL.createObjectURL(file);
          setImageUrl(url);
        } else {
          const content = await readFileContent(file);
          setFileContent(content);
        }
      } catch (error) {
        console.error("Error reading file:", error);
        setError("Error reading file. Please try again.");
        setFileContent(null);
        setImageUrl(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          if (
            file.type === "text/csv" ||
            file.type === "text/plain" ||
            file.name.endsWith(".csv") ||
            file.name.endsWith(".txt")
          ) {
            const content = event.target?.result as string;
            resolve(content);
          } else {
            resolve(
              "This file type is not supported for preview. Please use an image, text, or CSV file."
            );
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsText(file);
    });
  };

  const handleContinue = async () => {
    if (!selectedFile) return;
    console.log("Processing file:", selectedFile.name);
  };

  return (
    // <ProtectedRoute>
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/learning-path"
            className="flex items-center text-[#612665] hover:text-[#4d1e51] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Learning Path
          </Link>
        </div>

        <div className="grid grid-cols-6 gap-8">
          {/* Left Section - File Upload */}
          <div className="col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-[#612665] mb-6">
              Financial Analysis
            </h1>
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl text-[#612665] mb-6">
                Upload Your Financial Statement
              </h2>
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/*,.txt,.csv"
                />
                <div className="flex flex-col gap-4">
                  <label
                    htmlFor="file-upload"
                    className="bg-[#612665] text-white px-6 py-3 rounded-full hover:bg-[#4d1e51] transition-colors cursor-pointer text-center text-lg"
                  >
                    Choose File
                  </label>
                  <span className="text-gray-500 text-base text-center break-words">
                    {fileName || "No file selected"}
                  </span>
                </div>
                {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
              </div>
              {selectedFile && !error && (
                <button
                  onClick={handleContinue}
                  className="mt-8 w-full bg-[#612665] text-white py-3 rounded-lg hover:bg-[#4d1e51] transition-colors text-lg"
                >
                  Continue
                </button>
              )}
            </div>
          </div>

          {/* Right Section - Comparative Analysis */}
          <div className="col-span-4 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-[#612665] mb-6">
              Comparative Analysis
            </h2>
            <div className="flex flex-col gap-6">
              {/* Image Containers - Side by Side */}
              <div className="grid grid-cols-2 gap-6">
                {/* Balance Sheet Section */}
                <div>
                  <h3 className="text-lg font-semibold text-[#612665] mb-4">
                    Your Balance Sheet
                  </h3>
                  <div
                    className="bg-gray-50 p-4 rounded-lg"
                    style={{ height: "700px" }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#612665]"></div>
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center h-full text-red-500">
                        {error}
                      </div>
                    ) : imageUrl ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={imageUrl}
                          alt="Uploaded balance sheet"
                          fill
                          style={{ objectFit: "contain" }}
                          className="rounded-lg"
                          priority
                          sizes="(max-width: 768px) 100vw, 50vw"
                          quality={100}
                        />
                      </div>
                    ) : fileContent ? (
                      <div className="whitespace-pre-wrap font-mono text-sm overflow-auto h-full">
                        {fileContent}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        Upload an image, text, or CSV file to see its contents
                        here
                      </div>
                    )}
                  </div>
                </div>

                {/* Company Analysis Section */}
                <div>
                  <h3 className="text-lg font-semibold text-[#612665] mb-4">
                    Company Analysis
                  </h3>
                  <div
                    className="bg-gray-50 p-4 rounded-lg"
                    style={{ height: "700px" }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src="/walmart.png"
                        alt="Walmart Balance Sheet"
                        fill
                        style={{ objectFit: "contain" }}
                        className="rounded-lg"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        quality={100}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Sections */}
              <div className="grid grid-cols-2 gap-6">
                {/* Advice Section */}
                <div>
                  <h3 className="text-lg font-semibold text-[#612665] mb-4">
                    Advice
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-[#612665]">
                        Asset Utilization & Liquidity
                      </h4>
                      <p className="text-gray-600">
                        Personal Finance: Keep a balance between liquid assets
                        (cash, savings) and investments for long-term growth.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#612665]">
                        Investment Growth & Diversification
                      </h4>
                      <p className="text-gray-600">
                        Personal Finance: Consider diversifying your portfolio
                        (investments, side businesses) to increase financial
                        stability.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#612665]">
                        Long-Term vs. Short-Term Planning
                      </h4>
                      <p className="text-gray-600">
                        Personal Finance: Plan for long-term financial goals
                        while managing short-term needs.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Current Practices Section */}
                <div>
                  <h3 className="text-lg font-semibold text-[#612665] mb-4">
                    Current Practices
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Walmart manages inventory efficiently by minimizing excess
                      stock while ensuring products are available when needed.
                    </p>
                    <p className="text-gray-600">
                      Expands revenue through e-commerce, retail locations, and
                      credit cards.
                    </p>
                    <p className="text-gray-600">
                      Walmart balances short-term operational efficiency with
                      long-term strategic investments in technology and
                      sustainability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </ProtectedRoute>
  );
};

export default AnalysisPage;
