import React, { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import { Quiz } from '../utils/groq';

interface VideoPlayerProps {
  videoId: string;
  quizzes: Quiz[];
  onQuizComplete: (score: number) => void;
}

interface AnsweredQuestion {
  questionIndex: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

const VIDEO_LENGTH_SECONDS = 900; // 15 minutes

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, quizzes, onQuizComplete }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<number>>(new Set());
  const [answeredQuestions, setAnsweredQuestions] = useState<Map<number, AnsweredQuestion>>(new Map());
  const playerRef = useRef<YT.Player | null>(null);
  const checkInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkForQuiz = () => {
      if (!playerRef.current || showQuiz) return;

      const currentTime = playerRef.current.getCurrentTime();
      
      // Don't check for quizzes past the video length
      if (currentTime >= VIDEO_LENGTH_SECONDS) return;

      const nextQuiz = quizzes.find(quiz => 
        quiz.timestamp <= currentTime && 
        quiz.timestamp > (currentTime - 2) && 
        quiz.timestamp < VIDEO_LENGTH_SECONDS
      );

      if (nextQuiz) {
        setCurrentQuiz(nextQuiz);
        setShowQuiz(true);
        playerRef.current.pauseVideo();
      }
    };

    checkInterval.current = setInterval(() => {
      if (!playerRef.current) return;
      
      const currentTime = Math.floor(playerRef.current.getCurrentTime());
      
      const quizToShow = quizzes.find(quiz => 
        quiz.timestamp === currentTime && 
        !completedQuizzes.has(quiz.timestamp)
      );
      
      if (quizToShow) {
        playerRef.current.pauseVideo();
        setCurrentQuiz(quizToShow);
        setShowQuiz(true);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setAttempts(new Array(quizToShow.questions.length).fill(0));
        setScore(0);
      }
    }, 1000);

    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, [quizzes, showQuiz, completedQuizzes]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!currentQuiz) return;

    const isCorrect = answerIndex === currentQuiz.questions[currentQuestionIndex].correctAnswer;

    // Store the answered question
    setAnsweredQuestions(prev => {
      const newAnswers = new Map(prev);
      newAnswers.set(currentQuestionIndex, {
        questionIndex: currentQuestionIndex,
        selectedAnswer: answerIndex,
        isCorrect
      });
      return newAnswers;
    });

    setSelectedAnswer(answerIndex);

    if (isCorrect) {
      setShowExplanation(true);
      setScore(prev => prev + 100);
    }
  };

  const handleNextQuestion = () => {
    if (!currentQuiz) return;

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const finalScore = Math.round(score / currentQuiz.questions.length);
      onQuizComplete(finalScore);
      setCompletedQuizzes(prev => new Set([...prev, currentQuiz.timestamp]));
      setShowQuiz(false);
      setCurrentQuiz(null);
      if (playerRef.current) {
        playerRef.current.playVideo();
      }
    }
  };

  const onReady = (event: { target: YT.Player }) => {
    playerRef.current = event.target;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-[1600px] mx-auto">
      {/* Video Section */}
      <div className="lg:w-3/5">
        <div className="rounded-xl overflow-hidden shadow-lg bg-white">
          <YouTube
            videoId={videoId}
            opts={{
              height: '100%',
              width: '100%',
              playerVars: {
                autoplay: 1,
                controls: 1,
                modestbranding: 1,
                rel: 0,
              },
            }}
            onReady={onReady}
            className="aspect-video w-full"
          />
        </div>
      </div>

      {/* Knowledge Checks Section */}
      <div className="lg:w-2/5 space-y-6">
        <div className="sticky top-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-[#612665] mb-6 flex items-center">
              <span className="mr-3">📝</span>
              Knowledge Checks
            </h2>

            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
              {quizzes.sort((a, b) => a.timestamp - b.timestamp).map((quiz, quizIndex) => (
                <div 
                  key={quiz.timestamp}
                  className={`rounded-lg transition-all duration-300 ${
                    currentQuiz?.timestamp === quiz.timestamp
                      ? 'transform scale-102'
                      : ''
                  }`}
                >
                  <div className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                    completedQuizzes.has(quiz.timestamp)
                      ? 'border-green-500 bg-green-50'
                      : currentQuiz?.timestamp === quiz.timestamp
                      ? 'border-[#612665] bg-white shadow-lg'
                      : 'border-gray-200 bg-white hover:border-[#612665]/50'
                  }`}>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          completedQuizzes.has(quiz.timestamp)
                            ? 'bg-green-500 text-white'
                            : 'bg-[#F3F0F4] text-[#612665]'
                        }`}>
                          {completedQuizzes.has(quiz.timestamp) ? '✓' : quizIndex + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-[#612665] ml-3">
                          Check Point {quizIndex + 1}
                        </h3>
                      </div>
                      <div className="text-sm font-medium px-3 py-1 rounded-full bg-[#F3F0F4] text-[#612665]">
                        {Math.floor(quiz.timestamp / 60)}:{(quiz.timestamp % 60).toString().padStart(2, '0')}
                      </div>
                    </div>

                    {currentQuiz?.timestamp === quiz.timestamp && showQuiz ? (
                      <div className="space-y-6">
                        {/* Progress Bar */}
                        <div className="relative h-1 bg-[#F3F0F4] rounded-full overflow-hidden">
                          <div 
                            className="absolute left-0 top-0 h-full bg-[#612665] transition-all duration-300"
                            style={{ width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%` }}
                          />
                        </div>

                        <div className="flex justify-between items-center text-sm text-[#b8a3be]">
                          <span>Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</span>
                          <span>Score: {score}</span>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-medium text-[#612665]">
                            {currentQuiz.questions[currentQuestionIndex].question}
                          </h4>
                          
                          <div className="space-y-3">
                            {currentQuiz.questions[currentQuestionIndex].options.map((option, index) => {
                              const answeredQuestion = answeredQuestions.get(currentQuestionIndex);
                              const isAnswered = answeredQuestion !== undefined;
                              const isSelected = isAnswered && answeredQuestion.selectedAnswer === index;
                              const isCorrectAnswer = currentQuiz.questions[currentQuestionIndex].correctAnswer === index;
                              
                              return (
                                <button
                                  key={index}
                                  onClick={() => !showExplanation && handleAnswerSelect(index)}
                                  disabled={showExplanation || isAnswered}
                                  className={`group w-full p-4 text-left rounded-lg border-2 transition-all duration-300
                                    ${isSelected 
                                      ? isCorrectAnswer
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-red-500 bg-red-50'
                                      : isAnswered && isCorrectAnswer
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200 hover:border-[#612665] hover:shadow-md'
                                    }
                                  `}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3
                                        ${isSelected 
                                          ? isCorrectAnswer
                                            ? 'bg-green-500 text-white'
                                            : 'bg-red-500 text-white'
                                          : isAnswered && isCorrectAnswer
                                            ? 'bg-green-500 text-white'
                                            : 'border-2 border-gray-300 group-hover:border-[#612665]'
                                        }
                                      `}>
                                        {(isSelected || (isAnswered && isCorrectAnswer)) && (
                                          isCorrectAnswer ? '✓' : '✗'
                                        )}
                                      </div>
                                      <span className={
                                        isSelected 
                                          ? isCorrectAnswer
                                            ? 'text-green-700'
                                            : 'text-red-700'
                                          : isAnswered && isCorrectAnswer
                                            ? 'text-green-700'
                                            : 'text-gray-700'
                                      }>{option}</span>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {selectedAnswer !== null && !showExplanation && 
                           selectedAnswer !== currentQuiz.questions[currentQuestionIndex].correctAnswer && (
                            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200 text-red-700">
                              <p className="font-medium mb-1">Not quite right!</p>
                              <p className="text-sm">Try again! Select another answer.</p>
                            </div>
                          )}

                          {showExplanation && (
                            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center mb-3">
                                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mr-3">
                                  ✓
                                </div>
                                <p className="text-green-700 font-medium">Excellent!</p>
                              </div>
                              <p className="text-green-600 mb-4">
                                {currentQuiz.questions[currentQuestionIndex].explanation}
                              </p>
                              <button
                                onClick={handleNextQuestion}
                                className="w-full py-3 px-4 bg-[#612665] text-white rounded-lg hover:bg-[#4d1e51] transition-all duration-300 transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-[#612665] focus:ring-offset-2"
                              >
                                {currentQuestionIndex < currentQuiz.questions.length - 1 
                                  ? "Next Question" 
                                  : "Continue Video"
                                }
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[#b8a3be] text-sm">
                        {completedQuizzes.has(quiz.timestamp)
                          ? "Great job! You've completed this knowledge check."
                          : "This knowledge check will appear when you reach this point in the video."}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 