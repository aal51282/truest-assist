import { NextResponse } from 'next/server';
import { generateQuizFromTranscript } from '@/utils/groq';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { videoId } = await request.json();
    
    // Validate videoId
    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Read transcript file
    const transcriptPath = path.join(process.cwd(), 'src', 'data', 'transcripts', `${videoId}.txt`);
    const transcript = await fs.readFile(transcriptPath, 'utf-8');

    // Generate quizzes using GROQ
    const quizzes = await generateQuizFromTranscript(transcript);

    // Cache the generated quizzes (optional - implement caching as needed)
    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error('Error in quiz generation:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
} 