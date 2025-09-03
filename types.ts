export interface NucleotideCounts {
  A: number;
  T: number;
  C: number;
  G: number;
  total: number;
}

export interface OpenReadingFrame {
  frame: string; // e.g., '+1', '-2'
  start: number; // 1-based start coordinate on the original sequence
  end: number;   // 1-based end coordinate on the original sequence
  length: number; // in amino acids
  protein: string;
}

export interface AnalysisResult {
  isValid: boolean;
  cleanedSequence: string;
  length: number;
  nucleotideCounts: NucleotideCounts;
  gcContent: number;
  complement: string;
  reverseComplement: string;
  transcription: string;
  orfs: OpenReadingFrame[];
}