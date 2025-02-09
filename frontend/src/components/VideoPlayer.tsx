import React, { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import { Quiz, QuizQuestion } from '../utils/groq';

interface VideoPlayerProps {
  videoId: string;
  quizzes: Quiz[];
  onQuizComplete: (score: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, quizzes, onQuizComplete }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const playerRef = useRef<any>(null);
  const checkInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Sort quizzes by timestamp to ensure proper ordering
    const sortedQuizzes = [...quizzes].sort((a, b) => a.timestamp - b.timestamp);
    
    // Check for quiz triggers every second
    checkInterval.current = setInterval(() => {
      if (!playerRef.current) return;
      
      const currentTime = Math.floor(playerRef.current.getCurrentTime());
      setCurrentTime(currentTime);
      
      // Find if we should show a quiz at this timestamp
      const quizToShow = sortedQuizzes.find(quiz => 
        quiz.timestamp === currentTime && 
        !showQuiz
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
  }, [quizzes, showQuiz]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!currentQuiz) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentQuiz.questions[currentQuestionIndex].correctAnswer;

    if (!isCorrect) {
      // Increment attempts for this question
      const newAttempts = [...attempts];
      newAttempts[currentQuestionIndex]++;
      setAttempts(newAttempts);
    } else {
      setShowExplanation(true);
      setScore(prev => prev + Math.max(0, 100 - attempts[currentQuestionIndex] * 20));
    }
  };

  const handleNextQuestion = () => {
    if (!currentQuiz) return;

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz completed
      const finalScore = Math.round(score / currentQuiz.questions.length);
      onQuizComplete(finalScore);
      setShowQuiz(false);
      setCurrentQuiz(null);
      if (playerRef.current) {
        playerRef.current.playVideo();
      }
    }
  };

  const onReady = (event: any) => {
    playerRef.current = event.target;
  };

  return (
    <div className="relative w-full">
      <YouTube
        videoId={videoId}
        opts={{
          height: '390',
          width: '640',
          playerVars: {
            autoplay: 1,
            controls: 1,
          },
        }}
        onReady={onReady}
        className="w-full"
      />
      
      {showQuiz && currentQuiz && (
        <div className="mt-4 p-6 bg-white rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#612665]">Knowledge Check!</h2>
            <div className="text-[#b8a3be]">
              Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-[#612665]">
                {currentQuiz.questions[currentQuestionIndex].question}
              </h3>
              <div className="text-sm text-[#b8a3be]">
                Attempts: {attempts[currentQuestionIndex]}
              </div>
            </div>
            
            <div className="space-y-3">
              {currentQuiz.questions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showExplanation && handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors
                    ${selectedAnswer === index 
                      ? index === currentQuiz.questions[currentQuestionIndex].correctAnswer
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-[#612665]'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {selectedAnswer === index && (
                      <span className={index === currentQuiz.questions[currentQuestionIndex].correctAnswer 
                        ? 'text-green-500'
                        : 'text-red-500'
                      }>
                        {index === currentQuiz.questions[currentQuestionIndex].correctAnswer ? '✓' : '✗'}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {selectedAnswer !== null && !showExplanation && 
             selectedAnswer !== currentQuiz.questions[currentQuestionIndex].correctAnswer && (
              <div className="mt-4 text-red-500">
                Not quite right. Try again!
              </div>
            )}

            {showExplanation && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-700 font-medium mb-2">Excellent!</p>
                <p className="text-green-600">
                  {currentQuiz.questions[currentQuestionIndex].explanation}
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="mt-4 px-6 py-2 bg-[#612665] text-white rounded-lg hover:bg-[#4d1e51] transition-colors"
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
      )}
    </div>
  );
};

export default VideoPlayer; 