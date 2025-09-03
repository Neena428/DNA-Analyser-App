
export interface NucleotideCounts {
  A: number;
  T: number;
  C: number;
  G: number;
  total: number;
}

export interface TranslationFrame {
  frame: number;
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
  translations: TranslationFrame[];
}
