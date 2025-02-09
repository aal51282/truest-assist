'use client'
import React, { useState, useEffect, useRef } from 'react';

interface SpeechToTextProps {
  onTranscriptChange: (transcript: string) => void; // Callback for transcript change
  onDifficultyChange: (difficulty: string) => void; // Callback for difficulty change
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onTranscriptChange, onDifficultyChange }) => {
  const [transcript, setTranscript] = useState<string>('');
  const [listening, setListening] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<string>(''); // State for difficulty level
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Ensure we're in the browser
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.error('Speech recognition not supported in this browser.');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Continue listening until explicitly stopped
      recognition.interimResults = true; // Show interim results while speaking
      recognition.lang = 'en-US'; // Set your preferred language

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        // Process all results from the event
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcriptChunk = result[0].transcript;
          if (result.isFinal) {
            finalTranscript += transcriptChunk;
          } else {
            interimTranscript += transcriptChunk;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
        onTranscriptChange(finalTranscript + interimTranscript); // Call the prop function
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
      };

      recognitionRef.current = recognition;
    }
  }, [onTranscriptChange]);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      setTranscript(''); // Optionally clear previous transcript
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const handleSubmit = async () => {
    if (!transcript || !difficulty) {
      alert('Please provide a transcript and select a difficulty level.');
      return;
    }

    const response = await fetch('/api/evaluateResponse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: transcript,
        userAnswer: transcript, // Assuming the user answer is the same as the transcript
        difficulty: difficulty,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Response from evaluateResponse API:', result);
      // Handle success (e.g., show a success message or redirect)
    } else {
      console.error('Error submitting the transcript:', response.statusText);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Speech to Text</h1>
      <div>
        <button onClick={startListening} disabled={listening}>
          Start Listening
        </button>
        <button onClick={stopListening} disabled={!listening} style={{ marginLeft: '1rem' }}>
          Stop Listening
        </button>
      </div>
      <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
        <p>{transcript || 'Your speech will appear here...'}</p>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <label>
          Select Difficulty Level:
          <select value={difficulty} onChange={(e) => {
            setDifficulty(e.target.value);
            onDifficultyChange(e.target.value); // Call the prop function
          }}>
            <option value="">Select...</option>
            <option value="hard">Hard (Module 3)</option>
            <option value="medium">Medium (Module 2)</option>
          </select>
        </label>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleSubmit} disabled={!transcript || !difficulty}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default SpeechToText;