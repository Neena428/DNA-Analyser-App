import type { AnalysisResult, NucleotideCounts, OpenReadingFrame } from '../types';
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

const findOrfsOnStrand = (
  originalDna: string,
  strandDna: string,
  strand: '+' | '-'
): OpenReadingFrame[] => {
  const rna = transcribe(strandDna);
  const orfs: OpenReadingFrame[] = [];
  const stopCodons = ['UAA', 'UAG', 'UGA'];
  const totalLength = originalDna.length;

  for (let frame = 0; frame < 3; frame++) {
    const frameId = `${strand}${frame + 1}`;
    
    for (let i = frame; i < rna.length - 2; i += 3) {
      const codon = rna.substring(i, i + 3);

      if (codon === 'AUG') { // Potential start codon
        let protein = 'M';
        let end = -1;
        
        // Scan for the next in-frame stop codon
        for (let j = i + 3; j < rna.length - 2; j += 3) {
          const nextCodon = rna.substring(j, j + 3);
          if (stopCodons.includes(nextCodon)) {
            end = j;
            break;
          }
          const aminoAcid = CODON_TABLE[nextCodon];
          protein += aminoAcid || '?';
        }

        if (end !== -1) {
          const startOnStrand = i + 1;
          const endOnStrand = end + 3;

          let finalStart, finalEnd;
          if (strand === '+') {
            finalStart = startOnStrand;
            finalEnd = endOnStrand;
          } else {
            // Map coordinates from reverse complement back to the original forward strand
            finalStart = totalLength - endOnStrand + 1;
            finalEnd = totalLength - startOnStrand + 1;
          }
          
          orfs.push({
            frame: frameId,
            start: finalStart,
            end: finalEnd,
            length: protein.length,
            protein,
          });

          // Move index past this found ORF to find subsequent, non-overlapping ORFs
          i = end;
        }
      }
    }
  }
  return orfs;
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

  const forwardOrfs = findOrfsOnStrand(cleanedSequence, cleanedSequence, '+');
  const reverseOrfs = findOrfsOnStrand(cleanedSequence, reverseComplement, '-');
  const orfs = [...forwardOrfs, ...reverseOrfs];

  return {
    isValid: true,
    cleanedSequence,
    length: cleanedSequence.length,
    nucleotideCounts,
    gcContent,
    complement,
    reverseComplement,
    transcription,
    orfs,
  };
};