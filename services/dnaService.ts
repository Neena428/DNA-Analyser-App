
import type { AnalysisResult, NucleotideCounts, TranslationFrame } from '../types';
import { CODON_TABLE } from '../constants';

const cleanSequence = (sequence: string): string => {
  return sequence.toUpperCase().replace(/[^ATCG]/g, '');
};

const validateDna = (sequence: string): boolean => {
  return /^[ATCG\s]*$/i.test(sequence);
};

const countNucleotides = (sequence: string): NucleotideCounts => {
  const counts = { A: 0, T: 0, C: 0, G: 0, total: sequence.length };
  for (const nucleotide of sequence) {
    if (nucleotide in counts) {
      (counts as any)[nucleotide]++;
    }
  }
  return counts;
};

const getComplement = (sequence: string): string => {
  const complementMap: { [key: string]: string } = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
  return sequence.split('').map(n => complementMap[n]).join('');
};

const getReverseComplement = (sequence:string): string => {
    const complement = getComplement(sequence);
    return complement.split('').reverse().join('');
};

const calculateGcContent = (counts: NucleotideCounts): number => {
    if (counts.total === 0) return 0;
    const gcCount = counts.G + counts.C;
    return (gcCount / counts.total) * 100;
};

const transcribe = (sequence: string): string => {
  return sequence.replace(/T/g, 'U');
};

const translate = (rnaSequence: string): TranslationFrame[] => {
  const results: TranslationFrame[] = [];
  const stopCodons = ['UAA', 'UAG', 'UGA'];

  for (let frame = 0; frame < 3; frame++) {
    let protein = '';
    const frameRna = rnaSequence.substring(frame);
    const startIndex = frameRna.indexOf('AUG');

    if (startIndex !== -1) {
      let isTranslating = false;
      for (let i = startIndex; i < frameRna.length - 2; i += 3) {
        const codon = frameRna.substring(i, i + 3);
        if (codon.length < 3) break;
        
        const aminoAcid = CODON_TABLE[codon];
        if (!aminoAcid) {
          protein += '?'; // Represents an unknown codon
          continue;
        }

        if (aminoAcid === 'STOP') {
          break; // Stop translation for this frame
        }
        protein += aminoAcid;
      }
    }
    results.push({ frame: frame + 1, protein: protein || 'No start codon (AUG) found in this reading frame.' });
  }
  return results;
};


export const analyzeDna = (sequence: string): AnalysisResult => {
  if (!validateDna(sequence)) {
    throw new Error('Invalid DNA sequence. The sequence can only contain A, T, C, G and whitespace.');
  }

  const cleanedSequence = cleanSequence(sequence);
  if (cleanedSequence.length === 0) {
    throw new Error('Sequence is empty after cleaning whitespace and invalid characters.');
  }

  const nucleotideCounts = countNucleotides(cleanedSequence);
  const gcContent = calculateGcContent(nucleotideCounts);
  const complement = getComplement(cleanedSequence);
  const reverseComplement = getReverseComplement(cleanedSequence);
  const transcription = transcribe(cleanedSequence);
  const translations = translate(transcription);

  return {
    isValid: true,
    cleanedSequence,
    length: cleanedSequence.length,
    nucleotideCounts,
    gcContent,
    complement,
    reverseComplement,
    transcription,
    translations,
  };
};
