
import React from 'react';
import type { AnalysisResult, NucleotideCounts, TranslationFrame } from '../types';
import ResultCard from './ResultCard';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

const NucleotideChart: React.FC<{ counts: NucleotideCounts }> = ({ counts }) => {
    const total = counts.total;
    if (total === 0) return null;
    const percentages = {
        A: (counts.A / total) * 100,
        T: (counts.T / total) * 100,
        C: (counts.C / total) * 100,
        G: (counts.G / total) * 100,
    };
    return (
        <div className="w-full flex h-6 rounded-full overflow-hidden bg-slate-200 mt-2">
            <div className="bg-green-500" style={{ width: `${percentages.A}%` }} title={`A: ${counts.A} (${percentages.A.toFixed(1)}%)`}></div>
            <div className="bg-red-500" style={{ width: `${percentages.T}%` }} title={`T: ${counts.T} (${percentages.T.toFixed(1)}%)`}></div>
            <div className="bg-blue-500" style={{ width: `${percentages.C}%` }} title={`C: ${counts.C} (${percentages.C.toFixed(1)}%)`}></div>
            <div className="bg-yellow-500" style={{ width: `${percentages.G}%` }} title={`G: ${counts.G} (${percentages.G.toFixed(1)}%)`}></div>
        </div>
    );
}

const SequenceDisplay: React.FC<{ sequence: string }> = ({ sequence }) => (
    <p className="font-mono text-sm bg-slate-100 p-3 rounded-md break-all max-h-48 overflow-y-auto">
        {sequence}
    </p>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ResultCard title="Validation & Length">
        <p className="text-green-600 font-semibold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Valid DNA Sequence
        </p>
        <p className="mt-2 text-slate-600">
          Sequence Length: <span className="font-bold">{result.length} bp</span>
        </p>
      </ResultCard>

      <ResultCard title="Nucleotide Counts" className="md:col-span-2">
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2 bg-green-100 rounded">A: <span className="font-bold">{result.nucleotideCounts.A}</span></div>
            <div className="p-2 bg-red-100 rounded">T: <span className="font-bold">{result.nucleotideCounts.T}</span></div>
            <div className="p-2 bg-blue-100 rounded">C: <span className="font-bold">{result.nucleotideCounts.C}</span></div>
            <div className="p-2 bg-yellow-100 rounded">G: <span className="font-bold">{result.nucleotideCounts.G}</span></div>
        </div>
        <NucleotideChart counts={result.nucleotideCounts} />
      </ResultCard>

      <ResultCard title="GC Content">
        <p className="text-3xl font-bold text-sky-600">{result.gcContent.toFixed(2)}%</p>
        <p className="text-slate-500">The percentage of Guanine (G) and Cytosine (C) bases.</p>
      </ResultCard>

      <ResultCard title="Complement Strand" className="lg:col-span-2">
        <SequenceDisplay sequence={result.complement} />
      </ResultCard>
      
      <ResultCard title="Reverse Complement" className="lg:col-span-3">
        <SequenceDisplay sequence={result.reverseComplement} />
      </ResultCard>

      <ResultCard title="mRNA Transcript" className="lg:col-span-3">
        <SequenceDisplay sequence={result.transcription} />
      </ResultCard>

      <ResultCard title="Protein Translation (3 Reading Frames)" className="lg:col-span-3">
         <div className="space-y-4">
            {result.translations.map(({ frame, protein }) => (
                <div key={frame}>
                    <h4 className="font-semibold text-slate-700">Frame {frame}</h4>
                    <SequenceDisplay sequence={protein} />
                </div>
            ))}
         </div>
      </ResultCard>
    </div>
  );
};

export default ResultsDisplay;
