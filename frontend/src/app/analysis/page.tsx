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
  const [companyImageUrl, setCompanyImageUrl] =
    useState<string>("/walmart.png");
  const [hoveredLeft, setHoveredLeft] = useState(false);
  const [hoveredRight, setHoveredRight] = useState(false);

  // Array of available company PDFs
  const companyPdfs = [
    { name: "Walmart", url: "/walmart.png" },
    { name: "Amazon", url: "/amazon.png" },
    { name: "Apple", url: "/apple.png" },
  ];

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    isCompany = false
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (isCompany) {
        const url = URL.createObjectURL(file);
        setCompanyImageUrl(url);
        return;
      }

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

  const handleCompanyPdfSelect = (url: string) => {
    setCompanyImageUrl(url);
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
                  className="mt-8 w-full bg-gradient-to-r from-[#f5b142] to-[#e09415] text-white py-5 rounded-xl hover:from-[#ffbb33] hover:to-[#ff9500] transition-all duration-300 text-lg font-semibold flex items-center justify-center space-x-3 shadow-md shadow-amber-100/30 transform hover:scale-105 animate-pulse-subtle relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/40 via-transparent to-transparent w-1/2 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span className="tracking-wide">Analyze Balance Sheets</span>
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
                {/* Balance Sheet Section - Your Balance Sheet */}
                <div>
                  <h3 className="text-lg font-semibold text-[#612665] mb-4">
                    Your Balance Sheet
                  </h3>
                  <div
                    className="bg-gray-50 p-4 rounded-lg relative group"
                    style={{ height: "700px" }}
                    onMouseEnter={() => setHoveredLeft(true)}
                    onMouseLeave={() => setHoveredLeft(false)}
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

                    {/* Hover action overlay */}
                    <div
                      className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200 rounded-lg ${
                        hoveredLeft
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                    >
                      <div className="text-center">
                        <label
                          htmlFor="your-file-upload"
                          className="bg-white text-[#612665] font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors cursor-pointer inline-block"
                        >
                          Change Your Balance Sheet
                        </label>
                        <input
                          type="file"
                          id="your-file-upload"
                          className="hidden"
                          onChange={(e) => handleFileSelect(e)}
                          accept="image/*,.pdf,.txt,.csv"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Analysis Section */}
                <div>
                  <h3 className="text-lg font-semibold text-[#612665] mb-4">
                    Company Analysis
                  </h3>
                  <div
                    className="bg-gray-50 p-4 rounded-lg relative group"
                    style={{ height: "700px" }}
                    onMouseEnter={() => setHoveredRight(true)}
                    onMouseLeave={() => setHoveredRight(false)}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={companyImageUrl}
                        alt="Company Balance Sheet"
                        fill
                        style={{ objectFit: "contain" }}
                        className="rounded-lg"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        quality={100}
                      />
                    </div>

                    {/* Hover action overlay */}
                    <div
                      className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200 rounded-lg ${
                        hoveredRight
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                    >
                      <div className="text-center space-y-4">
                        <div className="flex gap-2 justify-center mb-4">
                          {companyPdfs.map((pdf) => (
                            <button
                              key={pdf.name}
                              onClick={() => handleCompanyPdfSelect(pdf.url)}
                              className="bg-white text-[#612665] font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              {pdf.name}
                            </button>
                          ))}
                        </div>
                        <div>
                          <label
                            htmlFor="company-file-upload"
                            className="bg-white text-[#612665] font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors cursor-pointer inline-block"
                          >
                            Upload Custom PDF
                          </label>
                          <input
                            type="file"
                            id="company-file-upload"
                            className="hidden"
                            onChange={(e) => handleFileSelect(e, true)}
                            accept="image/*,.pdf"
                          />
                        </div>
                      </div>
                    </div>
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
