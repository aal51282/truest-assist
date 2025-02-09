"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  progress?: number;
}

const DashboardPage = () => {
  const [selectedModule, setSelectedModule] = useState<string>("balance-sheet");
  const [playerRef, setPlayerRef] = useState<YT.Player | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const router = useRouter();

  const modules: Module[] = [
    {
      id: "balance-sheet",
      title: "Balance Sheet Analysis",
      videoId: "Sx2R6qS8ZJw",
      description:
        "Learn to analyze balance sheets and understand key financial ratios",
    },
    {
      id: "ebitda",
      title: "EBITDA Calculation",
      videoId: "I7ND6z5eXmo",
      description:
        "Master the calculation and interpretation of EBITDA metrics",
    },
    {
      id: "horizontal",
      title: "Horizontal Analysis",
      videoId: "MwMZATCDas4",
      description:
        "Compare financial metrics across time periods and identify key trends",
    },
  ];

  const selectedModuleData = modules.find((m) => m.id === selectedModule);

  const achievements: Achievement[] = [
    {
      id: "first_module",
      title: "First Steps",
      description: "Complete your first learning module",
      icon: "🎯",
      isUnlocked: true,
      progress: 80,
    },
    {
      id: "quiz_master",
      title: "Quiz Master",
      description: "Score 100% on any quiz",
      icon: "🏆",
      isUnlocked: false,
      progress: 40,
    },
    {
      id: "balance_expert",
      title: "Balance Expert",
      description: "Complete the Balance Sheet module",
      icon: "📊",
      isUnlocked: false,
      progress: 20,
    },
    {
      id: "streak_3",
      title: "On Fire!",
      description: "Login 3 days in a row",
      icon: "🔥",
      isUnlocked: false,
      progress: 66,
    },
  ];

  // Initialize YouTube player when component mounts
  React.useEffect(() => {
    // Clean up previous player
    if (playerRef) {
      playerRef.destroy?.();
    }

    // Load YouTube API if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Initialize YouTube player when API is ready
    const initPlayer = () => {
      const player = new window.YT.Player("youtube-player", {
        videoId: selectedModuleData?.videoId || "Sx2R6qS8ZJw",
        playerVars: {
          controls: 1,
          disablekb: 1,
          rel: 0,
          modestbranding: 1,
        },
      });
      setPlayerRef(player);
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    // Cleanup function
    return () => {
      if (playerRef) {
        playerRef.destroy?.();
      }
    };
  }, [selectedModule]);

  const leaderboardData: LeaderboardEntry[] = [
    {
      id: 1,
      name: "Guy Hawkins",
      avatar: "/avatars/guy.png",
      date: "8 Feb, 11:24 AM",
      status: "Completed",
    },
    {
      id: 2,
      name: "Jacob Harris",
      avatar: "/avatars/jacob.png",
      date: "8 Feb, 11:24 AM",
      status: "Incomplete",
    },
    {
      id: 3,
      name: "Angel Jones",
      avatar: "/avatars/angel.png",
      date: "8 Feb, 11:24 AM",
      status: "In Progress",
    },
    {
      id: 4,
      name: "Esther Wilson",
      avatar: "/avatars/esther.png",
      date: "8 Feb, 11:24 AM",
      status: "Completed",
    },
    {
      id: 5,
      name: "Blake Lively",
      avatar: "/avatars/blake.png",
      date: "8 Feb, 11:24 AM",
      status: "In Progress",
    },
  ];

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.push('/splash');
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-[#612665] mb-4">
              Confirm Logout
            </h2>
            <p className="text-[#b8a3be] mb-6">
              Are you sure you want to logout? Your progress will be saved.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                className="flex-1 py-3 px-4 bg-[#612665] text-white rounded-lg hover:bg-[#4d1e51] transition-colors"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 px-4 border-2 border-[#612665] text-[#612665] rounded-lg hover:bg-[#F3F0F4] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 border-r border-[#F3F0F4] fixed h-screen flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[#F3F0F4]">
          <Link href="/learning-path">
            <Image
              src="/logo.png"
              alt="Truest Assist Logo"
              width={150}
              height={32}
              className="object-contain cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="p-6 space-y-8 flex-grow overflow-y-auto">
          {/* Modules Section */}
          <div>
            <h2 className="text-lg font-semibold text-[#612665] mb-4">Modules</h2>
            <ul className="space-y-3">
              {modules.map((module) => (
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
                <a 
                  href="https://www.youtube.com/@FinanceableTraining" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#b8a3be] hover:text-[#612665]"
                >
                  Videos
                </a>
              </li>
              <li>
                <Link href="/analysis" className="text-[#b8a3be] hover:text-[#612665]">
                  Practice
                </Link>
              </li>
            </ul>
          </div>

          {/* Achievements Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#612665]">Achievements</h2>
              <button
                onClick={() => setShowAllAchievements(!showAllAchievements)}
                className="text-sm text-[#612665] hover:underline flex items-center gap-1"
              >
                {showAllAchievements ? (
                  <>
                    Show less
                    <span className="text-xs">↑</span>
                  </>
                ) : (
                  <>
                    Show all
                    <span className="text-xs">↓</span>
                  </>
                )}
              </button>
            </div>
            <div className="space-y-3">
              {achievements
                .slice(0, showAllAchievements ? achievements.length : 3)
                .map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    achievement.isUnlocked
                      ? "border-[#612665] bg-[#F3F0F4]"
                      : "border-[#F3F0F4]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        achievement.isUnlocked ? "text-[#612665]" : "text-[#b8a3be]"
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className="text-xs text-[#b8a3be] mb-2">
                        {achievement.description}
                      </p>
                      {achievement.progress !== undefined && (
                        <div className="w-full h-1.5 bg-[#F3F0F4] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#612665] rounded-full transition-all"
                            style={{ width: `${achievement.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Settings and Logout */}
        <div className="p-6 space-y-4 border-t border-[#F3F0F4] bg-white">
          <Link href="/settings" className="flex items-center text-[#b8a3be] hover:text-[#612665]">
            <span className="mr-2">⚙️</span>
            Settings
          </Link>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center text-[#b8a3be] hover:text-[#612665] w-full"
          >
            <span className="mr-2">🚪</span>
            Logout
          </button>
          <div className="text-xs text-[#b8a3be] mt-4">
            Need Help? <Link href="/help" className="text-[#612665]">Ask TrustBot</Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 ml-64">
        {selectedModuleData && (
          <>
            <h1 className="text-4xl font-bold text-[#612665] mb-6">
              {selectedModuleData.title}
            </h1>
            <div className="max-w-5xl">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="relative" style={{ paddingBottom: "45%" }}>
                  <div
                    id="youtube-player"
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
              </div>
            </div>
            <p className="text-[#b8a3be] mb-8 max-w-5xl text-lg">
              {selectedModuleData.description}
            </p>
          </>
        )}

        {selectedModule === "balance-sheet" && (
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-8 mb-8 max-w-5xl">
              <div>
                <h3 className="font-semibold text-[#612665] mb-2 text-xl">Content</h3>
                <ul className="space-y-2 text-[#b8a3be] text-lg">
                  <li>Balance Sheet Equation</li>
                  <li>Cash and Accounts Receivable</li>
                  <li>Inventory</li>
                  <li>Prepaid Expenses</li>
                  <li>Property, Plant, and Equipment</li>
                  <li>Accounts Payable</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[#612665] mb-2 text-xl">Additional Topics</h3>
                <ul className="space-y-2 text-[#b8a3be] text-lg">
                  <li>Liabilities</li>
                  <li>Deferred Revenue</li>
                  <li>Long-term Debt</li>
                  <li>Assets & Liabilities</li>
                  <li>Common Stock and Retained Earnings</li>
                </ul>
              </div>
            </div>
            <Link
              href="/learning/balance-sheet"
              className="inline-block px-8 py-4 bg-[#612665] text-white rounded-lg hover:bg-[#4d1e51] transition-colors text-lg"
            >
              Go to Module
            </Link>
          </div>
        )}

        {selectedModule === "ebitda" && (
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-8 mb-8 max-w-4xl">
              <div>
                <h3 className="font-semibold text-[#612665] mb-1">Content</h3>
                <ul className="space-y-1 text-[#b8a3be]">
                  <li>What is EBITDA?</li>
                  <li>EBITDA Formula</li>
                  <li>EBITDA Example Walk Through</li>
                  <li>Pros & Cons of Using EBITDA</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[#612665] mb-1">Additional Topics</h3>
                <ul className="space-y-1 text-[#b8a3be]">
                  <li>Depreciation vs Amortization</li>
                  <li>Capital Expenses and the Matching Principle</li>
                  <li>The Role of FASB and Useful Life of Assets</li>
                </ul>
              </div>
            </div>
            <Link
              href="/learning/ebitda"
              className="inline-block px-6 py-3 bg-[#612665] text-white rounded-lg hover:bg-[#4d1e51] transition-colors"
            >
              Go to Module
            </Link>
          </div>
        )}

        {selectedModule === "horizontal" && (
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-8 mb-8 max-w-4xl">
              <div>
                <h3 className="font-semibold text-[#612665] mb-1">Content</h3>
                <ul className="space-y-1 text-[#b8a3be]">
                  <li>Introduction to Horizontal Analysis</li>
                  <li>Setting Up the Horizontal Analysis</li>
                  <li>Computing Increases and Decreases</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[#612665] mb-1">Additional Topics</h3>
                <ul className="space-y-1 text-[#b8a3be]">
                  <li>Calculating Percentage Changes</li>
                  <li>Why Companies Use Horizontal Analysis</li>
                </ul>
              </div>
            </div>
            <Link
              href="/learning/horizontal-analysis"
              className="inline-block px-6 py-3 bg-[#612665] text-white rounded-lg hover:bg-[#4d1e51] transition-colors"
            >
              Go to Module
            </Link>
          </div>
        )}

        {/* Leaderboard Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-[#612665] mb-4">
            Leaderboard
          </h2>
          <div className="bg-white rounded-xl border border-[#F3F0F4] max-w-5xl">
            <div className="grid grid-cols-[2fr_1fr_1fr] p-4 border-b border-[#F3F0F4] font-semibold text-[#612665] text-lg">
              <div>Name</div>
              <div className="pl-4">Date</div>
              <div>Status</div>
            </div>
            {leaderboardData.map((entry) => (
              <div
                key={entry.id}
                className="grid grid-cols-[2fr_1fr_1fr] p-4 border-b border-[#F3F0F4] items-center text-lg hover:bg-[#F3F0F4] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={entry.avatar}
                    alt={entry.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="text-[#612665] font-medium">{entry.name}</span>
                </div>
                <div className="text-[#b8a3be] pl-4">{entry.date}</div>
                <div>
                  {entry.status === "Completed" && (
                    <span className="text-green-500 flex items-center font-medium">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      Completed
                    </span>
                  )}
                  {entry.status === "Incomplete" && (
                    <span className="text-red-500 flex items-center font-medium">
                      <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                      Incomplete
                    </span>
                  )}
                  {entry.status === "In Progress" && (
                    <span className="text-blue-500 flex items-center font-medium">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                      In Progress
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
