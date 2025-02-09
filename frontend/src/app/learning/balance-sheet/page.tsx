"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { getQuizQuestions } from "@/data/transcripts/balance-sheet";
import ReactConfetti from 'react-confetti';
import { useRouter } from "next/navigation";
import VideoPlayer from '@/components/VideoPlayer';
import ProtectedRoute from "@/components/ProtectedRoute";
import { Quiz } from '@/utils/groq';

// YouTube IFrame API TypeScript declarations
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          playerVars?: {
            controls?: number;
            disablekb?: number;
            rel?: number;
            modestbranding?: number;
            start?: number;
          };
          events?: {
            onReady?: (event: YT.PlayerEvent) => void;
            onStateChange?: (event: YT.OnStateChangeEvent) => void;
          };
        }
      ) => YT.Player;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
  }

  namespace YT {
    interface Player {
      playVideo(): void;
      pauseVideo(): void;
      getCurrentTime(): number;
      seekTo(seconds: number, allowSeekAhead?: boolean): void;
    }

    interface PlayerEvent {
      target: Player;
    }

    interface OnStateChangeEvent {
      target: Player;
      data: number;
    }
  }
}

interface ContentSection {
  id: string;
  title: string;
  isCompleted: boolean;
  hasGame?: boolean;
  path: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  timestamp: number;
  questions: QuizQuestion[];
}

const BalanceSheetPage = () => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const contentSections: ContentSection[] = [
    {
      id: "equation",
      title: "Balance Sheet Equation",
      isCompleted: false,
      path: "/learning/balance-sheet/equation",
    },
    {
      id: "cash",
      title: "Cash and Accounts Receivable",
      isCompleted: false,
      path: "/learning/balance-sheet/cash-ar",
    },
    {
      id: "inventory",
      title: "Inventory",
      isCompleted: false,
      path: "/learning/balance-sheet/inventory",
    },
    {
      id: "inventory-game",
      title: "(mini Game)",
      isCompleted: false,
      hasGame: true,
      path: "/learning/balance-sheet/inventory-game",
    },
    {
      id: "prepaid",
      title: "Prepaid Expenses",
      isCompleted: false,
      path: "/learning/balance-sheet/prepaid",
    },
    {
      id: "ppe",
      title: "Property, Plant, and Equipment",
      isCompleted: false,
      path: "/learning/balance-sheet/ppe",
    },
    {
      id: "ppe-game",
      title: "(mini Game)",
      isCompleted: false,
      hasGame: true,
      path: "/learning/balance-sheet/ppe-game",
    },
    {
      id: "ap",
      title: "Accounts Payable",
      isCompleted: false,
      path: "/learning/balance-sheet/accounts-payable",
    },
    {
      id: "liabilities",
      title: "Liabilities",
      isCompleted: false,
      path: "/learning/balance-sheet/liabilities",
    },
    {
      id: "deferred",
      title: "Deferred Revenue",
      isCompleted: false,
      path: "/learning/balance-sheet/deferred-revenue",
    },
    {
      id: "longterm",
      title: "Long-Term Debt",
      isCompleted: false,
      path: "/learning/balance-sheet/long-term-debt",
    },
    {
      id: "debt-game",
      title: "(mini Game)",
      isCompleted: false,
      hasGame: true,
      path: "/learning/balance-sheet/debt-game",
    },
    {
      id: "assets",
      title: "Assets & Liabilities",
      isCompleted: false,
      path: "/learning/balance-sheet/assets-liabilities",
    },
    {
      id: "equity",
      title: "Common Stack and Retained Earnings",
      isCompleted: false,
      path: "/learning/balance-sheet/equity",
    },
    {
      id: "quiz",
      title: "Quiz 1",
      isCompleted: false,
      hasGame: true,
      path: "/learning/balance-sheet/quiz",
    },
  ];

  const quizQuestions = getQuizQuestions();

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const response = await fetch('/api/quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoId: 'balance-sheet' }),
        });

        if (!response.ok) {
          throw new Error('Failed to load quizzes');
        }

        const data = await response.json();
        setQuizzes(data.quizzes);
      } catch (error) {
        console.error('Error loading quizzes:', error);
        setError('Error loading quizzes');
      } finally {
        setIsLoadingQuizzes(false);
      }
    };

    loadQuizzes();

    // Cleanup function
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Clear any stored progress when component mounts
    sessionStorage.removeItem('videoProgress');

    // Load YouTube API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize YouTube player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("youtube-player", {
        videoId: "Sx2R6qS8ZJw",
        playerVars: {
          controls: 1,        // Show player controls
          disablekb: 1,      // Disable keyboard controls
          rel: 0,            // Don't show related videos
          modestbranding: 1, // Show modest branding
          start: 0          // Always start from beginning
        },
        events: {
          onStateChange: onPlayerStateChange,
          onReady: onPlayerReady,
        },
      });
    };

    // Initialize audio element
    audioRef.current = new Audio('/celebration.mp3');
    audioRef.current.volume = 0.5; // Set volume to 50%

    // Clear stored progress when component unmounts
    return () => {
      sessionStorage.removeItem('videoProgress');
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  const onPlayerReady = () => {
    // Ensure video starts from beginning
    playerRef.current?.seekTo(0, true);
    
    // Add time update listener
    const timeUpdateInterval = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        const storedTime = Number(sessionStorage.getItem('videoProgress')) || 0;
        
        // If user tries to rewind (current time is less than stored time)
        if (currentTime < storedTime) {
          playerRef.current.seekTo(storedTime, true);
        } else {
          // Update stored time if moving forward
          sessionStorage.setItem('videoProgress', String(currentTime));
        }
      }
    }, 1000);

    // Clean up interval on unmount
    return () => clearInterval(timeUpdateInterval);
  };

  // Update the player state change handler
  const onPlayerStateChange = (event: { data: number }) => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }

    const currentTime = playerRef.current?.getCurrentTime() || 0;
    const storedTime = Number(sessionStorage.getItem('videoProgress')) || 0;
    
    if (currentTime < storedTime) {
      playerRef.current?.seekTo(storedTime, true);
    }

    if (event.data === window.YT.PlayerState.ENDED) {
      setVideoEnded(true);
      handleCompleteModule();
      return;
    }

    if (event.data === window.YT.PlayerState.PLAYING) {
      checkIntervalRef.current = setInterval(checkForQuiz, 500);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!currentQuiz || incorrectAnswers.includes(answerIndex)) return;
    
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const correct = answerIndex === currentQuestion.correctAnswer;
    
    setSelectedAnswer(answerIndex);
    setIsCorrect(correct);
    setShowExplanation(true);

    if (correct) {
      // Update quiz score and proceed
      setQuizScores(prev => ({
        ...prev,
        [currentQuiz.timestamp]: (prev[currentQuiz.timestamp] || 0) + 1
      }));
      setShortAnswer("");
      setIncorrectAnswers([]);
    } else {
      // Add to incorrect answers and show hint
      setIncorrectAnswers(prev => [...prev, answerIndex]);
      setShortAnswer("Try again! Think about what we learned in the video about this concept.");
    }
  };

  const handleNextQuestion = () => {
    if (!currentQuiz || !isCorrect || isSubmitting) return;

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIncorrectAnswers([]);
      setShortAnswer("");
    } else {
      // Prevent multiple submissions
      setIsSubmitting(true);
      
      // Quiz completed - Start celebration
      setShowCelebration(true);
      playCelebrationSound();
      
      // Stop celebration after 3 seconds
      setTimeout(() => {
        setShowCelebration(false);
        
        // Continue with quiz completion logic
        const currentTime = playerRef.current?.getCurrentTime() || 0;
        const quizId = `quiz-${currentQuiz.timestamp}`;
        
        // Only add to completed sections if not already completed
        setCompletedSections(prev => 
          prev.includes(quizId) ? prev : [...prev, quizId]
        );
        
        setShowQuiz(false);
        setCurrentQuiz(null);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setIncorrectAnswers([]);
        setShortAnswer("");
        setIsSubmitting(false);
        
        // Set buffer and clear it after 2 seconds
        setQuizBuffer(true);
        
        // Ensure we're well past the quiz timestamp to prevent re-triggering
        const skipForwardTime = currentTime + 2;
        playerRef.current?.seekTo(skipForwardTime, true);
        sessionStorage.setItem('videoProgress', String(skipForwardTime));
        playerRef.current?.playVideo();
        
        setTimeout(() => {
          setQuizBuffer(false);
        }, 2000);
      }, 3000);
    }
  };

  const playCelebrationSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset to start
      audioRef.current.play().catch(err => console.log('Audio playback failed:', err));
    }
  };

  const handleCompleteModule = () => {
    // Mark all sections as completed
    const allSectionIds = contentSections.map(section => section.id);
    setCompletedSections(allSectionIds);
    
    // Show celebration and play sound
    setShowCelebration(true);
    playCelebrationSound();
    
    // Show completion modal after a short delay
    setTimeout(() => {
      setShowCompletionModal(true);
      setShowCelebration(false);
    }, 3000);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white p-8">
        {showCelebration && (
          <ReactConfetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={200}
            recycle={false}
            colors={['#612665', '#4d1e51', '#b8a3be', '#F3F0F4']}
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 100 }}
          />
        )}

        {/* Completion Modal */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
            <div className="bg-white p-8 rounded-xl max-w-md w-full mx-4 shadow-2xl text-center">
              <div className="text-6xl mb-4">🎸</div>
              <h2 className="text-2xl font-bold text-[#612665] mb-4">
                Congratulations!
              </h2>
              <p className="text-[#b8a3be] mb-6">
                You've completed the Balance Sheet Analysis module! You're now ready to tackle real-world financial analysis. Now it's time to learn about EBITDA Calculation!
              </p>
              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  router.push('/learning');
                }}
                className="w-full py-3 px-4 bg-[#612665] text-white rounded-lg hover:bg-[#4d1e51] transition-colors"
              >
                Continue Learning
              </button>
            </div>
          </div>
        )}
        
        {/* Back Button */}
        <Link
          href="/learning"
          className="inline-flex items-center text-[#612665] hover:underline mb-8"
        >
          <span className="mr-2">←</span>
          Back to Learning
        </Link>

        <div className="max-w-7xl mx-auto px-4">
          {/* Title */}
          <h1 className="text-4xl font-bold text-[#612665] mb-6">
            Balance Sheet Analysis
          </h1>

          {/* Video Section with Knowledge Checks */}
          <div className="mb-12">
            {!isLoadingQuizzes ? (
              <VideoPlayer
                videoId="Sx2R6qS8ZJw"
                quizzes={quizzes}
                onQuizComplete={(score) => {
                  // Update progress when a quiz is completed
                  const updatedCompletedSections = [...completedSections];
                  if (score >= 70) { // Pass threshold
                    setShowCelebration(true);
                    playCelebrationSound();
                    setTimeout(() => {
                      setShowCelebration(false);
                    }, 3000);
                  }
                  setCompletedSections(updatedCompletedSections);
                }}
              />
            ) : (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#612665] border-t-transparent"></div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-[#612665] mb-2">
              <span>Progress</span>
              <div className="flex items-center gap-4">
                <span>
                  {Math.round(
                    (completedSections.length / contentSections.length) * 100
                  )}
                  %
                </span>
                {process.env.NODE_ENV === 'development' && (
                  <button
                    onClick={handleCompleteModule}
                    className="text-xs px-2 py-1 bg-[#612665] text-white rounded hover:bg-[#4d1e51] transition-colors"
                  >
                    Complete Module
                  </button>
                )}
              </div>
            </div>
            <div className="w-full h-2 bg-[#F3F0F4] rounded-full">
              <div
                className="h-full bg-[#612665] rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (completedSections.length / contentSections.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default BalanceSheetPage;
