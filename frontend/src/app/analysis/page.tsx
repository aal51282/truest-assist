"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import * as pdfjs from 'pdfjs-dist';
import { fetchCompanyFinancials } from '@/services/financialApi';

interface FinancialMetrics {
  currentRatio?: number;
  debtToEquity?: number;
  profitMargin?: number;
}

interface CompanyData {
  name: string;
  metrics: FinancialMetrics;
  logoUrl: string;
}

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const AnalysisPage = () => {
  const [userFile, setUserFile] = useState<File | null>(null);
  const [userMetrics, setUserMetrics] = useState<FinancialMetrics | null>(null);

  // Sample company data (in a real app, this would come from an API)
  const companyComparisons: CompanyData[] = [
    {
      name: "Walmart",
      metrics: {
        currentRatio: 0.9,
        debtToEquity: 0.88,
        profitMargin: 2.39,
      },
      logoUrl: "/company-logos/walmart.png",
    },
    {
      name: "Home Depot",
      metrics: {
        currentRatio: 1.39,
        debtToEquity: 1.82,
        profitMargin: 10.87,
      },
      logoUrl: "/company-logos/homedepot.png",
    },
    // Add more companies as needed
  ];

  const processPdfFile = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }

      // Example pattern matching for financial metrics
      // You'll need to adjust these patterns based on your expected PDF format
      const metrics = extractFinancialMetrics(fullText);
      setUserMetrics(metrics);
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Error processing PDF. Please make sure it contains valid financial data.');
    }
  };

  const extractFinancialMetrics = (text: string): FinancialMetrics => {
    // This is a simplified example - you'll need to adjust the regex patterns
    // based on your expected PDF format
    const currentRatioMatch = text.match(/current ratio[:\s]+(\d+\.?\d*)/i);
    const debtToEquityMatch = text.match(/debt to equity[:\s]+(\d+\.?\d*)/i);
    const profitMarginMatch = text.match(/profit margin[:\s]+(\d+\.?\d*)/i);

    return {
      currentRatio: currentRatioMatch ? parseFloat(currentRatioMatch[1]) : undefined,
      debtToEquity: debtToEquityMatch ? parseFloat(debtToEquityMatch[1]) : undefined,
      profitMargin: profitMarginMatch ? parseFloat(profitMarginMatch[1]) : undefined,
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUserFile(file);

    if (file.type === 'application/pdf') {
      await processPdfFile(file);
    } else {
      // Handle other file types (CSV, Excel) as before
      // ... existing code ...
    }
  };

  const downloadTemplate = () => {
    const template = `Financial Statement Template

Current Assets: [Enter Amount]
Current Liabilities: [Enter Amount]
Current Ratio: [Will be calculated]

Total Debt: [Enter Amount]
Total Equity: [Enter Amount]
Debt to Equity Ratio: [Will be calculated]

Net Income: [Enter Amount]
Total Revenue: [Enter Amount]
Profit Margin: [Will be calculated]

Instructions:
1. Replace [Enter Amount] with your actual numbers
2. Save as PDF
3. Upload the file to compare with competitors`;
    const blob = new Blob([template], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'financial_statement_template.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-[#612665] mb-8">Financial Analysis</h1>

      {/* File Upload Section */}
      <div className="mb-12 p-6 border-2 border-dashed border-[#612665] rounded-xl">
        <h2 className="text-2xl font-bold text-[#612665] mb-4">Upload Your Financial Statement</h2>
        <p className="text-[#b8a3be] mb-4">
          Upload your financial statements (PDF, CSV, Excel) to compare with industry leaders
        </p>
        <input
          type="file"
          accept=".pdf,.csv,.xlsx,.xls"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-[#612665] file:text-white
            hover:file:bg-[#4c1e50]"
        />
        <p className="text-sm text-gray-500 mt-2">
          Supported formats: PDF, CSV, Excel (.xlsx, .xls)
        </p>
      </div>

      {/* Comparison Section */}
      {userMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companyComparisons.map((company) => (
            <div
              key={company.name}
              className="p-6 border-2 border-[#F3F0F4] rounded-xl hover:border-[#612665] transition-all"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 relative">
                  <Image
                    src={company.logoUrl}
                    alt={`${company.name} logo`}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#612665]">{company.name}</h3>
              </div>

              <div className="space-y-4">
                <ComparisonMetric
                  label="Current Ratio"
                  companyValue={company.metrics.currentRatio}
                  userValue={userMetrics.currentRatio}
                />
                <ComparisonMetric
                  label="Debt to Equity"
                  companyValue={company.metrics.debtToEquity}
                  userValue={userMetrics.debtToEquity}
                />
                <ComparisonMetric
                  label="Profit Margin (%)"
                  companyValue={company.metrics.profitMargin}
                  userValue={userMetrics.profitMargin}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips and Recommendations */}
      {userMetrics && (
        <div className="mt-12 p-6 bg-[#F3F0F4] rounded-xl">
          <h2 className="text-2xl font-bold text-[#612665] mb-4">Recommendations</h2>
          <div className="space-y-4">
            <RecommendationItem
              metric="currentRatio"
              value={userMetrics.currentRatio}
            />
            <RecommendationItem
              metric="debtToEquity"
              value={userMetrics.debtToEquity}
            />
            <RecommendationItem
              metric="profitMargin"
              value={userMetrics.profitMargin}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ComparisonMetric = ({ label, companyValue, userValue }: {
  label: string;
  companyValue?: number;
  userValue?: number;
}) => {
  const difference = userValue && companyValue ? userValue - companyValue : 0;
  
  return (
    <div className="flex justify-between items-center">
      <span className="text-[#b8a3be]">{label}</span>
      <div className="flex items-center space-x-4">
        <span className="text-[#612665] font-semibold">
          You: {userValue?.toFixed(2)}
        </span>
        <span className="text-gray-500">
          Them: {companyValue?.toFixed(2)}
        </span>
        <span className={`${difference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {difference >= 0 ? '↑' : '↓'}
        </span>
      </div>
    </div>
  );
};

const RecommendationItem = ({ metric, value }: { metric: string; value?: number }) => {
  const getRecommendation = () => {
    switch (metric) {
      case 'currentRatio':
        return value && value < 1 
          ? "Your current ratio is below 1, indicating potential liquidity issues. Consider improving your working capital management."
          : "Your current ratio is healthy. Continue maintaining good working capital practices.";
      case 'debtToEquity':
        return value && value > 2
          ? "Your debt-to-equity ratio is high. Consider reducing debt or increasing equity to improve financial stability."
          : "Your debt-to-equity ratio is within acceptable range. Monitor it to maintain financial health.";
      case 'profitMargin':
        return value && value < 5
          ? "Your profit margin is below industry average. Focus on cost reduction and pricing strategies."
          : "Your profit margin is competitive. Continue optimizing operations to maintain profitability.";
      default:
        return "";
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <p className="text-[#612665]">{getRecommendation()}</p>
    </div>
  );
};

const extractFinancialMetrics = (text: string): FinancialMetrics => {
  // Patterns for common financial statement formats
  const patterns = {
    currentRatio: [
      /current ratio[:\s]+(\d+\.?\d*)/i,
      /current assets[:\s]+(\d+\.?\d*)/i,
      /current liabilities[:\s]+(\d+\.?\d*)/i,
    ],
    debtToEquity: [
      /debt[\s-]to[\s-]equity[:\s]+(\d+\.?\d*)/i,
      /total debt[:\s]+(\d+\.?\d*)/i,
      /total equity[:\s]+(\d+\.?\d*)/i,
    ],
    profitMargin: [
      /profit margin[:\s]+(\d+\.?\d*)/i,
      /net income[:\s]+(\d+\.?\d*)/i,
      /total revenue[:\s]+(\d+\.?\d*)/i,
    ]
  };

  const metrics: FinancialMetrics = {
    currentRatio: undefined,
    debtToEquity: undefined,
    profitMargin: undefined
  };

  // Try to find direct ratios first
  for (const [metric, patternList] of Object.entries(patterns)) {
    for (const pattern of patternList) {
      const match = text.match(pattern);
      if (match) {
        metrics[metric as keyof FinancialMetrics] = parseFloat(match[1]);
        break;
      }
    }
  }

  // If direct ratios aren't found, try to calculate them
  if (!metrics.currentRatio) {
    const currentAssets = extractNumber(text, /current assets[:\s]+(\d+\.?\d*)/i);
    const currentLiabilities = extractNumber(text, /current liabilities[:\s]+(\d+\.?\d*)/i);
    if (currentAssets && currentLiabilities) {
      metrics.currentRatio = currentAssets / currentLiabilities;
    }
  }

  if (!metrics.debtToEquity) {
    const totalDebt = extractNumber(text, /total debt[:\s]+(\d+\.?\d*)/i);
    const totalEquity = extractNumber(text, /total equity[:\s]+(\d+\.?\d*)/i);
    if (totalDebt && totalEquity) {
      metrics.debtToEquity = totalDebt / totalEquity;
    }
  }

  if (!metrics.profitMargin) {
    const netIncome = extractNumber(text, /net income[:\s]+(\d+\.?\d*)/i);
    const revenue = extractNumber(text, /total revenue[:\s]+(\d+\.?\d*)/i);
    if (netIncome && revenue) {
      metrics.profitMargin = (netIncome / revenue) * 100;
    }
  }

  return metrics;
};

const extractNumber = (text: string, pattern: RegExp): number | null => {
  const match = text.match(pattern);
  return match ? parseFloat(match[1]) : null;
};

const extractFinancialMetricsFromCSV = (text: string): FinancialMetrics => {
  const lines = text.split('\n');
  const headers = lines[0].toLowerCase().split(',');
  const values = lines[1]?.split(',');

  const metrics: FinancialMetrics = {
    currentRatio: undefined,
    debtToEquity: undefined,
    profitMargin: undefined
  };

  headers.forEach((header, index) => {
    const value = values?.[index] ? parseFloat(values[index]) : undefined;
    if (header.includes('current ratio')) metrics.currentRatio = value;
    if (header.includes('debt to equity')) metrics.debtToEquity = value;
    if (header.includes('profit margin')) metrics.profitMargin = value;
  });

  return metrics;
};

export default AnalysisPage;