import type { Dimension, Answer } from './questionEngine';

export type Sequence = 'ABCD' | 'ABDC' | 'ACBD' | 'ACDB' | 'ADBC' | 'ADCB' |
  'BACD' | 'BADC' | 'BCAD' | 'BCDA' | 'BDAC' | 'BDCA' |
  'CABD' | 'CADB' | 'CBAD' | 'CBDA' | 'CDAB' | 'CDBA' |
  'DABC' | 'DACB' | 'DBAC' | 'DBCA' | 'DCAB' | 'DCBA';

export interface FrequencyCount {
  A: number;
  B: number;
  C: number;
  D: number;
}

export interface RankingResult {
  sequence: Sequence;
  frequencies: FrequencyCount;
  ranking: Dimension[];
}

const ALL_SEQUENCES: Sequence[] = [
  'ABCD', 'ABDC', 'ACBD', 'ACDB', 'ADBC', 'ADCB',
  'BACD', 'BADC', 'BCAD', 'BCDA', 'BDAC', 'BDCA',
  'CABD', 'CADB', 'CBAD', 'CBDA', 'CDAB', 'CDBA',
  'DABC', 'DACB', 'DBAC', 'DBCA', 'DCAB', 'DCBA'
];

export function countFrequencies(answers: Answer[]): FrequencyCount {
  const frequencies: FrequencyCount = { A: 0, B: 0, C: 0, D: 0 };
  for (const answer of answers) {
    frequencies[answer.dimension]++;
  }
  return frequencies;
}

export function generateRanking(frequencies: FrequencyCount): Dimension[] {
  const entries: [Dimension, number][] = [['A', frequencies.A], ['B', frequencies.B], ['C', frequencies.C], ['D', frequencies.D]];

  entries.sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });

  return entries.map(e => e[0]);
}

export function resolveTieBreaker(ranking: Dimension[], frequencies: FrequencyCount): Sequence {
  const baseSequence = ranking.join('') as Sequence;

  const sameFirstTwo = ALL_SEQUENCES.filter(seq => {
    return seq[0] === baseSequence[0] && seq[1] === baseSequence[1];
  });

  if (sameFirstTwo.length <= 1) {
    return baseSequence;
  }

  sameFirstTwo.sort((a, b) => {
    const aLast = a[3];
    const bLast = b[3];
    const freqA = frequencies[aLast as Dimension];
    const freqB = frequencies[bLast as Dimension];

    if (freqA !== freqB) return freqB - freqA;
    return a.localeCompare(b);
  });

  return sameFirstTwo[0];
}

export function determineSequence(answers: Answer[]): RankingResult {
  const frequencies = countFrequencies(answers);
  const ranking = generateRanking(frequencies);
  const sequence = resolveTieBreaker(ranking, frequencies);

  return {
    sequence,
    frequencies,
    ranking,
  };
}

export function getSequenceInfo(sequence: Sequence): { rank: number; name: string } {
  const rank = ALL_SEQUENCES.indexOf(sequence) + 1;
  return { rank, name: `第 ${rank} 号人格` };
}

export function getComplementarySequences(sequence: Sequence): Sequence[] {
  const seqArray = sequence.split('') as Dimension[];
  const reversed = [...seqArray].reverse();

  if (seqArray[0] === reversed[0]) {
    const swapped = [...seqArray];
    [swapped[2], swapped[3]] = [swapped[3], swapped[2]];
    return [swapped.join('') as Sequence, reversed.join('') as Sequence];
  }

  return [reversed.join('') as Sequence];
}
