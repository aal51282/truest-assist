"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FileProcessingService } from "@/services/fileProcessingService";
import { fetchCompanyFinancials } from "@/services/financialApi";
import { FinancialMetrics, CompanyComparison } from "@/types/financial";

const AnalysisPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userMetrics, setUserMetrics] = useState<FinancialMetrics | null>(null);
  const [competitors, setCompetitors] = useState<CompanyComparison[]>([]);

  useEffect(() => {
    // Fetch competitor data when component mounts
    const fetchCompetitors = async () => {
      try {
        const symbols = ['WMT', 'HD', 'BIG', 'IMKTA']; // Add more symbols as needed
        const companiesData = await fetchCompanyFinancials(symbols);
        
        // Transform the data into CompanyComparison format
        const comparisons = companiesData.map(company => ({
          symbol: company.symbol,
          name: company.name,
          metrics: {
            currentRatio: company.currentRatio,
            debtToEquity: company.debtToEquity,
            profitMargin: company.profitMargin,
            quickRatio: company.quickRatio,
            returnOnEquity: company.returnOnEquity,
            totalDebt: company.totalDebt,
            totalAssets: company.totalAssets,
          },
          logoUrl: `/company-logos/${company.symbol.toLowerCase()}.png`,
        }));

        setCompetitors(comparisons);
      } catch (err) {
        setError('Failed to fetch competitor data');
        console.error(err);
      }
    };

    fetchCompetitors();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      if (file.type === 'application/pdf') {
        const metrics = await FileProcessingService.processPdf(file);
        
        // Check if we got any valid metrics
        const hasValidMetrics = Object.values(metrics).some(value => value !== undefined);
        
        if (!hasValidMetrics) {
          setError('No financial metrics found in the PDF. Please check the file format.');
          return;
        }
        
        setUserMetrics(metrics);
      } else {
        setError('Please upload a PDF file');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process the file');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `Financial Statement Template

Current Assets: 100000
Current Liabilities: 50000
Current Ratio: 2.0

Total Debt: 200000
Total Equity: 300000
Debt to Equity Ratio: 0.67

Net Income: 50000
Total Revenue: 500000
Profit Margin: 10.0

Total Assets: 600000

Instructions:
1. Keep this format exactly as shown
2. Replace the numbers with your actual values
3. Save as PDF
4. Upload the file to compare with competitors`;
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
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-[#612665] file:text-white
            hover:file:bg-[#4c1e50]"
          disabled={loading}
        />
        {loading && <p className="text-gray-500 mt-2">Processing file...</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Comparison Section */}
      {userMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitors.map((company) => (
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

export default AnalysisPage;