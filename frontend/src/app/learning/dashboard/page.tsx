"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface LeaderboardEntry {
  id: number;
  name: string;
  avatar: string;
  date: string;
  status: "Completed" | "Incomplete" | "In Progress";
}

interface Module {
  id: string;
  title: string;
  videoId?: string;
  description: string;
}

const DashboardPage = () => {
  const [selectedModule, setSelectedModule] = useState<string>("balance-sheet");
  const [playerRef, setPlayerRef] = useState<any>(null);

  const modules: Module[] = [
    {
      id: "balance-sheet",
      title: "Balance Sheet Analysis",
      videoId: "Sx2R6qS8ZJw",
      description: "Learn to analyze balance sheets and understand key financial ratios"
    },
    {
      id: "ebitda",
      title: "EBITDA Calculation",
      description: "Master the calculation and interpretation of EBITDA metrics"
    },
    {
      id: "horizontal",
      title: "Horizontal Analysis",
      description: "Compare financial metrics across time periods and identify key trends"
    }
  ];

  // Initialize YouTube player when component mounts
  React.useEffect(() => {
    // Load YouTube API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize YouTube player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      const player = new window.YT.Player("youtube-player", {
        videoId: "Sx2R6qS8ZJw",
        playerVars: {
          controls: 1,
          disablekb: 1,
          rel: 0,
          modestbranding: 1
        }
      });
      setPlayerRef(player);
    };
  }, []);

  const leaderboardData: LeaderboardEntry[] = [
    {
      id: 1,
      name: "Guy Hawkins",
      avatar: "/avatars/guy.png",
      date: "8 Feb, 11:24 AM",
      status: "Completed"
    },
    {
      id: 2,
      name: "Jacob Harris",
      avatar: "/avatars/jacob.png",
      date: "8 Feb, 11:24 AM",
      status: "Incomplete"
    },
    {
      id: 3,
      name: "Angel Jones",
      avatar: "/avatars/angel.png",
      date: "8 Feb, 11:24 AM",
      status: "In Progress"
    },
    {
      id: 4,
      name: "Esther Wilson",
      avatar: "/avatars/esther.png",
      date: "8 Feb, 11:24 AM",
      status: "Completed"
    },
    {
      id: 5,
      name: "Blake Lively",
      avatar: "/avatars/blake.png",
      date: "8 Feb, 11:24 AM",
      status: "In Progress"
    }
  ];

  const selectedModuleData = modules.find(m => m.id === selectedModule);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-[#F3F0F4]">
        {/* Logo */}
        <div className="p-6 border-b border-[#F3F0F4]">
          <Image
            src="/logo.png"
            alt="Truest Assist Logo"
            width={150}
            height={32}
            className="object-contain"
          />
        </div>

        {/* Navigation Sections */}
        <div className="p-6 space-y-8">
          {/* Modules Section */}
          <div>
            <h2 className="text-lg font-semibold text-[#612665] mb-4">Modules</h2>
            <ul className="space-y-3">
              {modules.map(module => (
                <li key={module.id}>
                  <button
                    onClick={() => setSelectedModule(module.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedModule === module.id
                        ? "bg-[#F3F0F4] text-[#612665] font-semibold"
                        : "text-[#b8a3be] hover:text-[#612665]"
                    }`}
                  >
                    {module.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn More Section */}
          <div>
            <h2 className="text-lg font-semibold text-[#612665] mb-4">Learn More</h2>
            <ul className="space-y-3">
              <li>
                <Link href="/learning/videos" className="text-[#b8a3be] hover:text-[#612665]">
                  Videos
                </Link>
              </li>
              <li>
                <Link href="/learning/practice" className="text-[#b8a3be] hover:text-[#612665]">
                  Practice
                </Link>
              </li>
            </ul>
          </div>

          {/* Quizzes Section */}
          <div>
            <h2 className="text-lg font-semibold text-[#612665] mb-4">Quizzes</h2>
            <ul className="space-y-3">
              <li>
                <Link href="/learning/quiz1" className="text-[#b8a3be] hover:text-[#612665]">
                  Quiz 1
                </Link>
              </li>
              <li>
                <Link href="/learning/quiz2" className="text-[#b8a3be] hover:text-[#612665]">
                  Quiz 2
                </Link>
              </li>
              <li>
                <Link href="/learning/quiz3" className="text-[#b8a3be] hover:text-[#612665]">
                  Quiz 3
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Settings and Logout */}
        <div className="absolute bottom-0 left-0 w-64 p-6 space-y-4 border-t border-[#F3F0F4] bg-white">
          <Link href="/settings" className="flex items-center text-[#b8a3be] hover:text-[#612665]">
            <span className="mr-2">⚙️</span>
            Settings
          </Link>
          <Link href="/logout" className="flex items-center text-[#b8a3be] hover:text-[#612665]">
            <span className="mr-2">🚪</span>
            Logout
          </Link>
          <div className="text-xs text-[#b8a3be] mt-4">
            Need Help? <Link href="/help" className="text-[#612665]">Ask TrustBot</Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {selectedModuleData && (
          <>
            <h1 className="text-3xl font-bold text-[#612665] mb-6">{selectedModuleData.title}</h1>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="aspect-w-16 aspect-h-9 relative">
                <div id="youtube-player" className="w-full h-full" />
              </div>
            </div>
            <p className="text-[#b8a3be] mb-8">{selectedModuleData.description}</p>
          </>
        )}

        {selectedModule === "balance-sheet" && (
          <div className="mt-6 grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-[#612665] mb-2">Content</h3>
              <ul className="space-y-2 text-[#b8a3be]">
                <li>Balance Sheet Equation</li>
                <li>Cash and Accounts Receivable</li>
                <li>Inventory</li>
                <li>Prepaid Expenses</li>
                <li>Property, Plant, and Equipment</li>
                <li>Accounts Payable</li>
                <li>Liabilities</li>
                <li>Deferred Revenue</li>
                <li>Long-term Debt</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#612665] mb-2">Assets & Liabilities</h3>
              <ul className="space-y-2 text-[#b8a3be]">
                <li>Common Stock and Retained Earnings</li>
                <li>Quiz 1</li>
              </ul>
            </div>
          </div>
        )}

        {/* Leaderboard Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#612665] mb-4">Leader Board</h2>
          <div className="bg-white rounded-xl border border-[#F3F0F4]">
            <div className="grid grid-cols-4 p-4 border-b border-[#F3F0F4] font-semibold text-[#612665]">
              <div>Name</div>
              <div>Date</div>
              <div>Status</div>
            </div>
            {leaderboardData.map((entry) => (
              <div key={entry.id} className="grid grid-cols-4 p-4 border-b border-[#F3F0F4] items-center">
                <div className="flex items-center space-x-3">
                  <Image
                    src={entry.avatar}
                    alt={entry.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="text-[#612665]">{entry.name}</span>
                </div>
                <div className="text-[#b8a3be]">{entry.date}</div>
                <div>
                  {entry.status === "Completed" && (
                    <span className="text-green-500 flex items-center">
                      Completed <span className="ml-2">✓</span>
                    </span>
                  )}
                  {entry.status === "Incomplete" && (
                    <span className="text-red-500 flex items-center">
                      Incomplete <span className="ml-2">✗</span>
                    </span>
                  )}
                  {entry.status === "In Progress" && (
                    <span className="text-blue-500 flex items-center">
                      In Progress <span className="ml-2">⋯</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 