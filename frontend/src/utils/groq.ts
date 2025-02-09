import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  timestamp: number;
  questions: QuizQuestion[];
}

// Helper function to convert timestamp string to seconds
function convertTimestampToSeconds(timestamp: string): number {
  const match = timestamp.match(/\[(\d{2}):(\d{2})\]/);
  if (!match) return 0;
  const [, minutes, seconds] = match;
  return parseInt(minutes) * 60 + parseInt(seconds);
}

export async function generateQuizFromTranscript(transcript: string): Promise<Quiz[]> {
  // First, parse the transcript to find natural break points
  const timestampMatches = transcript.match(/\[\d{2}:\d{2}\]/g) || [];
  const timestamps = timestampMatches.map(convertTimestampToSeconds);

  const prompt = `
    You are an expert financial educator creating interactive video quizzes. Given the following video transcript, create unique and engaging quizzes that will appear at specific timestamps.
    
    The video has natural breaks at the following timestamps (in seconds):
    ${timestamps.join(', ')}
    
    Requirements for the quizzes:
    1. Create exactly one quiz for each of these timestamps: ${timestamps.slice(1).join(', ')} seconds
    2. Each quiz should have 2-3 multiple choice questions about the content covered since the previous timestamp
    3. Questions should test comprehension and critical thinking, not just recall
    4. Provide 4 clear and distinct options for each question
    5. Include a detailed explanation for why the correct answer is right
    6. Make sure questions are unique and not repetitive
    7. Focus on testing understanding of concepts rather than memorization
    
    Important formatting rules:
    1. Use the exact timestamps provided above
    2. Questions should be clear and unambiguous
    3. All options should be plausible but only one should be correct
    4. Explanations should be educational and reference the content
    5. Vary the difficulty of questions
    
    Format your response as a JSON array of quiz objects with this structure:
    [
      {
        "timestamp": number,
        "questions": [
          {
            "question": string,
            "options": string[],
            "correctAnswer": number,
            "explanation": string
          }
        ]
      }
    ]
    
    Transcript:
    ${transcript}
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.9, // Increased for more variety
      max_tokens: 4096,
      top_p: 0.9,
      frequency_penalty: 0.5, // Increased to reduce repetition
      presence_penalty: 0.5, // Increased to encourage novelty
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from GROQ');
    }

    // Extract the JSON from the response and validate its structure
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const quizzes = JSON.parse(jsonMatch[0]) as Quiz[];
    
    // Validate quiz structure
    if (!Array.isArray(quizzes) || quizzes.length === 0) {
      throw new Error('Invalid quiz structure');
    }

    // Ensure timestamps match our expected break points
    const validQuizzes = quizzes.filter(quiz => timestamps.includes(quiz.timestamp));

    // Sort quizzes by timestamp
    return validQuizzes.sort((a, b) => a.timestamp - b.timestamp);
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
} 