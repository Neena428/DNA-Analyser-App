
import React, { useState } from 'react';

interface DnaInputProps {
  onAnalyze: (sequence: string) => void;
  isLoading: boolean;
}

const DnaInput: React.FC<DnaInputProps> = ({ onAnalyze, isLoading }) => {
  const [sequence, setSequence] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(sequence);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <form onSubmit={handleSubmit}>
        <label htmlFor="dna-sequence" className="block text-lg font-semibold text-slate-700 mb-2">
          Enter DNA Sequence
        </label>
        <textarea
          id="dna-sequence"
          value={sequence}
          onChange={(e) => setSequence(e.target.value)}
          placeholder="Paste your DNA sequence here (e.g., ATCG...)"
          className="w-full h-40 p-3 font-mono text-sm border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 ease-in-out"
          disabled={isLoading}
        />
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !sequence}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Sequence'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DnaInput;
