import { NextResponse } from 'next/server';
import * as pdfjs from 'pdfjs-dist';

if (typeof window === 'undefined') {
  const worker = require('pdfjs-dist/build/pdf.worker.js');
  pdfjs.GlobalWorkerOptions.workerSrc = worker;
}

export async function POST(request: Request) {
  console.log('Received request');
  
  try {
    const formData = await request.formData();
    console.log('FormData received:', {
      keys: Array.from(formData.keys()),
      hasFile: formData.has('file'),
    });

    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ 
        error: 'No file uploaded',
        formDataKeys: Array.from(formData.keys()),
        formDataEntries: Object.fromEntries(formData.entries())
      }, { status: 400 });
    }

    // Log file details
    const fileDetails = {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: new Date(file.lastModified).toISOString()
    };

    console.log('File details:', fileDetails);

    if (!file.type.includes('pdf')) {
      return NextResponse.json({
        error: 'Invalid file type',
        expectedType: 'application/pdf',
        receivedType: file.type,
        fileDetails
      }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    console.log('File converted to ArrayBuffer, size:', arrayBuffer.byteLength);

    return NextResponse.json({
      success: true,
      message: 'File received successfully',
      fileDetails,
      bufferSize: arrayBuffer.byteLength
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({
      error: 'Request processing failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 