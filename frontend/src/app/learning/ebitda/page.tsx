"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  getQuizQuestions,
  getDepreciationQuizQuestions,
} from "@/data/transcripts/ebitda";
import ReactConfetti from "react-confetti";
import { useRouter } from "next/navigation";

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

const EBITDAPage = () => {
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
  const [quizTimelineMarkers, setQuizTimelineMarkers] = useState<
    Array<{ time: number; completed: boolean }>
  >([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const playerRef = useRef<YT.Player | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();
  const [currentVideo, setCurrentVideo] = useState<"ebitda" | "depreciation">(
    "ebitda"
  );
  const [videoEnded, setVideoEnded] = useState(false);

  const contentSections: ContentSection[] = [
    {
      id: "basics",
      title: "EBITDA Basics",
      isCompleted: false,
      path: "/learning/ebitda/basics",
    },
    {
      id: "calculation",
      title: "Calculation Methods",
      isCompleted: false,
      path: "/learning/ebitda/calculation",
    },
    {
      id: "calculator",
      title: "EBITDA Calculator",
      isCompleted: false,
      hasGame: true,
      path: "/learning/ebitda/calculator",
    },
    {
      id: "margins",
      title: "EBITDA Margins",
      isCompleted: false,
      path: "/learning/ebitda/margins",
    },
    {
      id: "analysis",
      title: "Company Analysis",
      isCompleted: false,
      path: "/learning/ebitda/analysis",
    },
    {
      id: "comparison",
      title: "Company Comparison Tool",
      isCompleted: false,
      hasGame: true,
      path: "/learning/ebitda/comparison",
    },
    {
      id: "limitations",
      title: "EBITDA Limitations",
      isCompleted: false,
      path: "/learning/ebitda/limitations",
    },
    {
      id: "quiz",
      title: "Final Assessment",
      isCompleted: false,
      hasGame: true,
      path: "/learning/ebitda/quiz",
    },
  ];

  const quizQuestions =
    currentVideo === "ebitda"
      ? getQuizQuestions()
      : getDepreciationQuizQuestions();

  // Initialize quiz timeline markers
  useEffect(() => {
    const markers = quizQuestions.map((quiz) => ({
      time: quiz.timestamp,
      completed: completedSections.includes(
        `quiz-${currentVideo}-${quiz.timestamp}`
      ),
    }));
    setQuizTimelineMarkers(markers);
  }, [completedSections, currentVideo]);

  // Add new function to handle video transition
  const initializePlayer = () => {
    // Destroy existing player if it exists
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    const videoId = currentVideo === "ebitda" ? "I7ND6z5eXmo" : "rE9Tc29A-fU";
    playerRef.current = new window.YT.Player("youtube-player", {
      videoId,
      playerVars: {
        controls: 1,
        disablekb: 1,
        rel: 0,
        modestbranding: 1,
        start: 0,
      },
      events: {
        onStateChange: onPlayerStateChange,
        onReady: onPlayerReady,
      },
    });
  };

  useEffect(() => {
    // Clear any stored progress when component mounts
    sessionStorage.removeItem("videoProgress");

    // Load YouTube API only if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      // Initialize YouTube player when API is ready
      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      // If API is already loaded, initialize player directly
      initializePlayer();
    }

    // Initialize audio element
    audioRef.current = new Audio("/celebration.mp3");
    audioRef.current.volume = 0.5;

    return () => {
      sessionStorage.removeItem("videoProgress");
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [currentVideo]); // Re-run when video changes

  const onPlayerReady = () => {
    playerRef.current?.seekTo(0, true);

    const timeUpdateInterval = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        const storedTime = Number(sessionStorage.getItem("videoProgress")) || 0;

        if (currentTime < storedTime) {
          playerRef.current.seekTo(storedTime, true);
        } else {
          sessionStorage.setItem("videoProgress", String(currentTime));
        }
      }
    }, 1000);

    return () => clearInterval(timeUpdateInterval);
  };

  const onPlayerStateChange = (event: { data: number }) => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }

    const currentTime = playerRef.current?.getCurrentTime() || 0;
    const storedTime = Number(sessionStorage.getItem("videoProgress")) || 0;

    if (currentTime < storedTime) {
      playerRef.current?.seekTo(storedTime, true);
    }

    // Handle video end
    if (event.data === window.YT.PlayerState.ENDED) {
      if (currentVideo === "ebitda") {
        setVideoEnded(true);
        // Switch to depreciation video after a short delay
        setTimeout(() => {
          setCurrentVideo("depreciation");
          // Reset progress
          sessionStorage.removeItem("videoProgress");
        }, 1000);
      } else {
        // Both videos completed
        handleCompleteModule();
      }
      return;
    }

    if (event.data === window.YT.PlayerState.PLAYING) {
      checkIntervalRef.current = setInterval(() => {
        if (!playerRef.current) return;

        const currentTime = playerRef.current.getCurrentTime();
        const storedTime = Number(sessionStorage.getItem("videoProgress")) || 0;

        if (currentTime < storedTime) {
          playerRef.current.seekTo(storedTime, true);
          return;
        }

        if (quizBuffer) return;

        const nextQuiz = quizQuestions.find(
          (q) =>
            Math.abs(q.timestamp - currentTime) < 0.5 &&
            !completedSections.includes(`quiz-${currentVideo}-${q.timestamp}`)
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

        sessionStorage.setItem("videoProgress", String(currentTime));
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
      setQuizScores((prev) => ({
        ...prev,
        [currentQuiz.timestamp]: (prev[currentQuiz.timestamp] || 0) + 1,
      }));
      setShortAnswer("");
      setIncorrectAnswers([]);
    } else {
      setIncorrectAnswers((prev) => [...prev, answerIndex]);
      setShortAnswer(
        "Try again! Think about what we learned in the video about this concept."
      );
    }
  };

  const handleNextQuestion = () => {
    if (!currentQuiz || !isCorrect || isSubmitting) return;

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIncorrectAnswers([]);
      setShortAnswer("");
    } else {
      setIsSubmitting(true);

      setShowCelebration(true);
      playCelebrationSound();

      setTimeout(() => {
        setShowCelebration(false);

        const currentTime = playerRef.current?.getCurrentTime() || 0;
        const quizId = `quiz-${currentVideo}-${currentQuiz.timestamp}`;

        setCompletedSections((prev) =>
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

        setQuizBuffer(true);

        const skipForwardTime = currentTime + 2;
        playerRef.current?.seekTo(skipForwardTime, true);
        sessionStorage.setItem("videoProgress", String(skipForwardTime));
        playerRef.current?.playVideo();

        setTimeout(() => {
          setQuizBuffer(false);
        }, 2000);
      }, 3000);
    }
  };

  const playCelebrationSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .catch((err) => console.log("Audio playback failed:", err));
    }
  };

  const handleCompleteModule = () => {
    const allSectionIds = contentSections.map((section) => section.id);
    setCompletedSections(allSectionIds);

    setShowCelebration(true);
    playCelebrationSound();

    setTimeout(() => {
      setShowCompletionModal(true);
      setShowCelebration(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {showCelebration && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          recycle={false}
          colors={["#612665", "#4d1e51", "#b8a3be", "#F3F0F4"]}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 100 }}
        />
      )}

      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
          <div className="bg-white p-8 rounded-xl max-w-md w-full mx-4 shadow-2xl text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-[#612665] mb-4">
              Congratulations!
            </h2>
            <p className="text-[#b8a3be] mb-6">
              You&apos;ve mastered EBITDA calculation and analysis! Ready to
              learn about Horizontal Analysis?
            </p>
            <button
              onClick={() => {
                setShowCompletionModal(false);
                router.push("/learning");
              }}
              className="w-full py-3 px-4 bg-[#612665] text-white rounded-lg hover:bg-[#4d1e51] transition-colors"
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}

      <Link
        href="/learning"
        className="inline-flex items-center text-[#612665] hover:underline mb-8"
      >
        <span className="mr-2">←</span>
        Back to Learning
      </Link>

      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#612665] mb-6">
          {currentVideo === "ebitda"
            ? "EBITDA Calculation"
            : "Depreciation vs Amortization"}
        </h1>

        {/* Video transition message */}
        {videoEnded && (
          <div className="mb-6 p-4 bg-[#F3F0F4] rounded-lg text-[#612665]">
            <p className="text-lg">
              Great job! Now let's learn about the difference between
              Depreciation and Amortization.
            </p>
          </div>
        )}

        <div className="mb-12 relative">
          <div className="relative" style={{ paddingBottom: "56.25%" }}>
            <div
              id="youtube-player"
              className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
            />
          </div>

          {showQuiz && currentQuiz && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-xl max-w-2xl w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 opacity-100">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#F3F0F4]">
                  <div
                    className="h-full bg-[#612665] transition-all duration-300"
                    style={{
                      width: `${
                        ((currentQuestionIndex + 1) /
                          currentQuiz.questions.length) *
                        100
                      }%`,
                    }}
                  />
                </div>

                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-[#612665]">
                    Pop Quiz!
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#612665] font-medium">
                      Question {currentQuestionIndex + 1} of{" "}
                      {currentQuiz.questions.length}
                    </span>
                  </div>
                </div>

                <p className="text-lg mb-6 text-[#612665]">
                  {currentQuiz.questions[currentQuestionIndex].question}
                </p>

                <div className="space-y-4 mb-6">
                  {currentQuiz.questions[currentQuestionIndex].options.map(
                    (option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={
                          incorrectAnswers.includes(index) ||
                          (showExplanation && isCorrect)
                        }
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300
                        ${
                          incorrectAnswers.includes(index)
                            ? "border-red-500 bg-red-50 opacity-50 cursor-not-allowed"
                            : selectedAnswer === index
                            ? isCorrect
                              ? "border-green-500 bg-green-50 animate-pulse"
                              : "border-red-500 bg-red-50"
                            : "border-[#F3F0F4] hover:border-[#612665] hover:shadow-md"
                        }
                      `}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center
                          ${
                            selectedAnswer === index && isCorrect
                              ? "bg-green-500 text-white"
                              : selectedAnswer === index
                              ? "bg-red-500 text-white"
                              : "border-2 border-[#612665]"
                          }`}
                          >
                            {selectedAnswer === index && isCorrect && (
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    )
                  )}
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
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 bg-[#612665] text-white rounded-lg transition-colors ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[#4d1e51]"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : currentQuestionIndex <
                      currentQuiz.questions.length - 1 ? (
                      "Next Question"
                    ) : (
                      "Continue Video"
                    )}
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
              {process.env.NODE_ENV === "development" && (
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
  );
};

export default EBITDAPage;
