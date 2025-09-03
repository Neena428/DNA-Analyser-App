
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import DnaInput from './components/DnaInput';
import ResultsDisplay from './components/ResultsDisplay';
import Loader from './components/Loader';
import { analyzeDna } from './services/dnaService';
import type { AnalysisResult } from './types';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAnalyze = useCallback(async (sequence: string) => {
    if (!sequence.trim()) {
      setError('Please enter a DNA sequence.');
      setAnalysisResult(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    // Simulate a short delay for better UX
    await new Promise(res => setTimeout(res, 300));

    try {
      const result = analyzeDna(sequence);
      setAnalysisResult(result);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <DnaInput onAnalyze={handleAnalyze} isLoading={isLoading} />
        
        {isLoading && (
          <div className="flex justify-center items-center mt-12">
            <Loader />
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-center" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {analysisResult && (
          <div className="mt-8">
            <ResultsDisplay result={analysisResult} />
          </div>
        )}
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>Built for advanced bioinformatics analysis.</p>
      </footer>
    </div>
  );
};

export default App;
