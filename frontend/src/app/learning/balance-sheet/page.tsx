"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getQuizQuestions } from "@/data/transcripts/balance-sheet";

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
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizScores, setQuizScores] = useState<{ [key: number]: number }>({});
  const [incorrectAnswers, setIncorrectAnswers] = useState<number[]>([]);
  const [shortAnswer, setShortAnswer] = useState<string>("");
  const [quizBuffer, setQuizBuffer] = useState(false);
  const [quizTimelineMarkers, setQuizTimelineMarkers] = useState<Array<{time: number, completed: boolean}>>([]);
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

  // Initialize quiz timeline markers
  useEffect(() => {
    const markers = quizQuestions.map(quiz => ({
      time: quiz.timestamp,
      completed: completedSections.includes(`quiz-${quiz.timestamp}`)
    }));
    setQuizTimelineMarkers(markers);
  }, [completedSections]);

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

  const onPlayerStateChange = (event: { data: number }) => {
    // Clear any existing interval
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }

    // Handle seeking attempts
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    const storedTime = Number(sessionStorage.getItem('videoProgress')) || 0;
    
    if (currentTime < storedTime) {
      playerRef.current?.seekTo(storedTime, true);
    }

    if (event.data === window.YT.PlayerState.PLAYING) {
      // Start checking for quiz timestamps
      checkIntervalRef.current = setInterval(() => {
        if (!playerRef.current) return;
        
        const currentTime = playerRef.current.getCurrentTime();
        const storedTime = Number(sessionStorage.getItem('videoProgress')) || 0;
        
        // Prevent rewinding
        if (currentTime < storedTime) {
          playerRef.current.seekTo(storedTime, true);
          return;
        }

        // Skip quiz check if we're in the buffer period
        if (quizBuffer) return;

        const nextQuiz = quizQuestions.find(
          (q) =>
            Math.abs(q.timestamp - currentTime) < 0.5 &&
            !completedSections.includes(`quiz-${q.timestamp}`)
        );

        if (nextQuiz) {
          playerRef.current.pauseVideo();
          setCurrentQuiz(nextQuiz);
          setCurrentQuestionIndex(0);
          setShowQuiz(true);
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
          }
        }

        // Update stored progress
        sessionStorage.setItem('videoProgress', String(currentTime));
      }, 500);
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
    if (!currentQuiz || !isCorrect) return;

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIncorrectAnswers([]);
      setShortAnswer("");
    } else {
      // Quiz completed
      const currentTime = playerRef.current?.getCurrentTime() || 0;
      setCompletedSections(prev => [...prev, `quiz-${currentQuiz.timestamp}`]);
      setShowQuiz(false);
      setCurrentQuiz(null);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIncorrectAnswers([]);
      setShortAnswer("");
      
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
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
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

        {/* Video Section */}
        <div className="mb-12 relative">
          <div className="relative" style={{ paddingBottom: "56.25%" }}>
            <div
              id="youtube-player"
              className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
            />
          </div>

          {/* Quiz Popup */}
          {showQuiz && currentQuiz && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-xl max-w-2xl w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 opacity-100">
                {/* Quiz Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#F3F0F4]">
                  <div 
                    className="h-full bg-[#612665] transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-[#612665]">Pop Quiz!</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#612665] font-medium">
                      Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
                    </span>
                  </div>
                </div>

                <p className="text-lg mb-6 text-[#612665]">{currentQuiz.questions[currentQuestionIndex].question}</p>
                
                <div className="space-y-4 mb-6">
                  {currentQuiz.questions[currentQuestionIndex].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={incorrectAnswers.includes(index) || (showExplanation && isCorrect)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300
                        ${incorrectAnswers.includes(index)
                          ? 'border-red-500 bg-red-50 opacity-50 cursor-not-allowed'
                          : selectedAnswer === index 
                            ? isCorrect 
                              ? 'border-green-500 bg-green-50 animate-pulse'
                              : 'border-red-500 bg-red-50'
                            : 'border-[#F3F0F4] hover:border-[#612665] hover:shadow-md'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center
                          ${selectedAnswer === index && isCorrect
                            ? 'bg-green-500 text-white'
                            : selectedAnswer === index
                              ? 'bg-red-500 text-white'
                              : 'border-2 border-[#612665]'
                          }`}
                        >
                          {selectedAnswer === index && isCorrect && (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {showExplanation && (
                  <div
                    className={`p-4 rounded-lg mb-6 ${
                      isCorrect
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    <p className="font-semibold mb-2">
                      {isCorrect ? "Correct!" : "Not quite right."}
                    </p>
                    <p>
                      {currentQuiz.questions[currentQuestionIndex].explanation}
                    </p>
                  </div>
                )}

                {showExplanation && (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 px-4 bg-[#612665] text-white rounded-lg hover:bg-[#4d1e51] transition-colors"
                  >
                    {currentQuestionIndex < currentQuiz.questions.length - 1
                      ? "Next Question"
                      : "Continue Video"}
                  </button>
                )}

                {showExplanation &&
                  currentQuestionIndex === currentQuiz.questions.length - 1 && (
                    <div className="mt-4 text-center text-[#612665]">
                      Quiz Score: {quizScores[currentQuiz.timestamp] || 0} /{" "}
                      {currentQuiz.questions.length}
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-[#612665] mb-2">
            <span>Progress</span>
            <span>
              {Math.round(
                (completedSections.length / contentSections.length) * 100
              )}
              %
            </span>
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
  );
};

export default BalanceSheetPage;
