import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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

export async function generateQuizFromTranscript(transcript: string): Promise<Quiz[]> {
  const prompt = `
    You are an expert financial educator. Given the following video transcript, create 3-4 quizzes, each with 3-4 questions.
    Each quiz should focus on a different section or concept from the transcript.
    
    For each quiz:
    1. Include a timestamp (in seconds) where this content appears in the transcript
    2. Create 3-4 multiple choice questions
    3. For each question, provide 4 options
    4. Indicate the correct answer (0-based index)
    5. Provide a brief explanation for why the answer is correct
    
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
    
    Here's the transcript:
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
      temperature: 0.5,
      max_tokens: 4096,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from GROQ');
    }

    // Extract the JSON from the response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const quizzes = JSON.parse(jsonMatch[0]) as Quiz[];
    return quizzes;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
} 