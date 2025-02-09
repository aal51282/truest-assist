'use client';

import { useState, useEffect } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import { generateQuizFromTranscript } from '../utils/groq';
import type { Quiz } from '../utils/groq';

export default function Home() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizzesCompleted, setQuizzesCompleted] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoading(true);
        const transcript = `
[00:30] Let's start with the basic balance sheet equation: Assets = Liabilities + Shareholders' Equity. This fundamental equation is the cornerstone of all financial statements. Assets represent what a company owns, liabilities represent what it owes, and shareholders' equity represents the net worth of the company.

[02:00] Moving on to current assets, let's focus on cash and accounts receivable. Cash is the most liquid asset and includes both physical currency and bank deposits. Accounts receivable represents money owed to the company by customers who purchased goods or services on credit.

[04:30] Inventory is another crucial current asset. It includes raw materials, work-in-progress, and finished goods. The way a company manages its inventory can significantly impact its profitability and cash flow. Companies use various methods to value their inventory, including FIFO (First-In-First-Out) and LIFO (Last-In-First-Out).

[07:00] Let's discuss property, plant, and equipment (PP&E). These are long-term assets that include buildings, machinery, and vehicles. PP&E is recorded at historical cost and depreciated over time. The accumulated depreciation reduces the asset's book value and reflects its decreasing value over time.`;
        
        const generatedQuizzes = await generateQuizFromTranscript(transcript);
        setQuizzes(generatedQuizzes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  const handleQuizComplete = (score: number) => {
    setTotalScore(prev => prev + score);
    setQuizzesCompleted(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#612665]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const averageScore = quizzesCompleted > 0 ? Math.round(totalScore / quizzesCompleted) : 0;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#612665] mb-8">Balance Sheet Analysis</h1>
        
        <div className="mb-8">
          <VideoPlayer
            videoId="Sx2R6qS8ZJw"
            quizzes={quizzes}
            onQuizComplete={handleQuizComplete}
          />
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-bold text-[#612665] mb-4">Your Progress</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[#b8a3be]">Quizzes Completed</p>
              <p className="text-2xl font-bold text-[#612665]">{quizzesCompleted} / {quizzes.length}</p>
            </div>
            <div>
              <p className="text-[#b8a3be]">Average Score</p>
              <p className="text-2xl font-bold text-[#612665]">{averageScore}%</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
