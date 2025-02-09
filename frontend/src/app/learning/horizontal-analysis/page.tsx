"use client";

import React from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import KnowledgeChecks from "@/components/KnowledgeChecks";

// Horizontal Analysis knowledge check points
const horizontalAnalysisCheckPoints = [
  {
    id: 1,
    title: "Understanding Horizontal Analysis",
    timestamp: "1:30",
    description: "Learn what horizontal analysis is and its importance in financial statement analysis."
  },
  {
    id: 2,
    title: "Calculation Method",
    timestamp: "3:45",
    description: "Master how to calculate year-over-year changes and growth percentages."
  },
  {
    id: 3,
    title: "Trend Analysis",
    timestamp: "6:00",
    description: "Understand how to identify and interpret financial trends over multiple periods."
  },
  {
    id: 4,
    title: "Practical Application",
    timestamp: "8:15",
    description: "Learn how to apply horizontal analysis to real company financial statements."
  }
];

const HorizontalAnalysisPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/learning"
            className="inline-flex items-center text-[#612665] hover:underline mb-8"
          >
            <span className="mr-2">←</span>
            Back to Learning
          </Link>
          <h1 className="text-[#612665] text-3xl font-bold mb-6">
            Horizontal Analysis
          </h1>
          <div className="flex gap-8">
            {/* Video Section */}
            <div className="flex-1">
              <div className="aspect-video bg-black rounded-lg">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/MwMZATCDas4"
                  title="Horizontal Analysis Explained"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Static Knowledge Checks Section */}
            <div className="w-[400px]">
              <KnowledgeChecks checkPoints={horizontalAnalysisCheckPoints} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default HorizontalAnalysisPage; 