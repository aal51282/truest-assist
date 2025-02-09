"use client";

import React, { useState } from 'react';

interface TestResponse {
  debug?: any;
  process?: any;
  rawText?: any;
}

export default function TestUpload() {
  const [response, setResponse] = useState<TestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('all');

  const testEndpoints = {
    'debug-pdf': 'Debug PDF (File Details)',
    'process-pdf': 'Process PDF (Extract Metrics)',
    'test-pdf': 'Test PDF (Raw Text)',
    'all': 'Test All Endpoints'
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResponse(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;

    if (!file) {
      setError('Please select a file');
      setIsLoading(false);
      return;
    }

    console.log('Testing with file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    try {
      const results: TestResponse = {};

      if (selectedEndpoint === 'all' || selectedEndpoint === 'debug-pdf') {
        const debugRes = await fetch('/api/debug-pdf', {
          method: 'POST',
          body: formData,
        });
        results.debug = await debugRes.json();
        console.log('Debug response:', results.debug);
      }

      if (selectedEndpoint === 'all' || selectedEndpoint === 'process-pdf') {
        const processRes = await fetch('/api/process-pdf', {
          method: 'POST',
          body: formData,
        });
        results.process = await processRes.json();
        console.log('Process response:', results.process);
      }

      if (selectedEndpoint === 'all' || selectedEndpoint === 'test-pdf') {
        const rawTextRes = await fetch('/api/test-pdf', {
          method: 'POST',
          body: formData,
        });
        results.rawText = await rawTextRes.json();
        console.log('Raw text response:', results.rawText);
      }

      setResponse(results);
    } catch (err) {
      console.error('Test error:', err);
      setError(err instanceof Error ? err.message : 'Test failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">PDF API Testing Page</h1>
      
      <div className="mb-8 p-4 bg-blue-50 rounded">
        <h2 className="font-bold mb-2">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Create a PDF with this content:
            <pre className="ml-4 mt-2 p-2 bg-white rounded">
              {`Financial Statement

Current Assets: 100000
Current Liabilities: 50000
Current Ratio: 2.0

Total Debt: 200000
Total Equity: 300000
Debt to Equity Ratio: 0.67

Net Income: 50000
Total Revenue: 500000
Profit Margin: 10.0

Total Assets: 600000`}
            </pre>
          </li>
          <li>Select which API endpoint to test</li>
          <li>Upload your PDF file and click Test</li>
        </ol>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Select Endpoint to Test:</label>
          <select
            value={selectedEndpoint}
            onChange={(e) => setSelectedEndpoint(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {Object.entries(testEndpoints).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Select PDF File:</label>
          <input
            type="file"
            name="file"
            accept=".pdf"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-50 file:text-purple-700
              hover:file:bg-purple-100"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Testing...' : 'Test PDF'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
          <h2 className="font-bold mb-2">Error:</h2>
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div className="mt-4 space-y-4">
          {response.debug && (
            <div className="p-4 bg-gray-50 rounded">
              <h2 className="font-bold mb-2">Debug Response:</h2>
              <pre className="whitespace-pre-wrap overflow-auto max-h-60">
                {JSON.stringify(response.debug, null, 2)}
              </pre>
            </div>
          )}
          
          {response.process && (
            <div className="p-4 bg-gray-50 rounded">
              <h2 className="font-bold mb-2">Process Response (Extracted Metrics):</h2>
              <pre className="whitespace-pre-wrap overflow-auto max-h-60">
                {JSON.stringify(response.process, null, 2)}
              </pre>
            </div>
          )}

          {response.rawText && (
            <div className="p-4 bg-gray-50 rounded">
              <h2 className="font-bold mb-2">Raw Text Response:</h2>
              <pre className="whitespace-pre-wrap overflow-auto max-h-60">
                {JSON.stringify(response.rawText, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 