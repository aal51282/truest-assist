import { NextResponse } from 'next/server';
import * as pdfjs from 'pdfjs-dist';

if (typeof window === 'undefined') {
  // Server-side initialization
  const worker = require('pdfjs-dist/build/pdf.worker.js');
  pdfjs.GlobalWorkerOptions.workerSrc = worker;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return NextResponse.json({
      text: fullText,
      numberOfPages: pdf.numPages,
    });
  } catch (error) {
    console.error('PDF test error:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF', details: error.message },
      { status: 500 }
    );
  }
} 