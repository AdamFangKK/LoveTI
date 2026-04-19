export type Dimension = 'A' | 'B' | 'C' | 'D';
export type Sequence = 'ABCD' | 'ABDC' | 'ACBD' | 'ACDB' | 'ADBC' | 'ADCB' |
  'BACD' | 'BADC' | 'BCAD' | 'BCDA' | 'BDAC' | 'BDCA' |
  'CABD' | 'CADB' | 'CBAD' | 'CBDA' | 'CDAB' | 'CDBA' |
  'DABC' | 'DACB' | 'DBAC' | 'DBCA' | 'DCAB' | 'DCBA';

export type LifePhase = 'firstMeet' | 'passion' | 'conflict' | 'stable' | 'distance' | 'longTerm';

export interface Persona {
  sequence: Sequence;
  sequenceRank: number;
  name: string;
  tags: string[];
  loveAnalysis: string;
  loveFilter: {
    worldColor: string;
    perceptionOfLove: string;
  };
  perfectMatch: {
    sequences: Sequence[];
    reason: string;
  };
  warningSign: {
    blindSpot: string;
    incompatibleTypes: string[];
    tone: 'humorous' | 'sharp';
  };
  visualConfig?: {
    primaryColor: string;
    accentColor: string;
    chartType: 'radar' | 'bar';
  };
}

export interface QuestionOption {
  text: string;
  dimension: Dimension;
}

export interface Question {
  id: number;
  content: string;
  lifePhase: LifePhase;
  options: {
    A: QuestionOption;
    B: QuestionOption;
    C: QuestionOption;
    D: QuestionOption;
  };
}

export interface Answer {
  questionId: number;
  dimension: Dimension;
}

export interface FrequencyCount {
  A: number;
  B: number;
  C: number;
  D: number;
}

export interface ChartData {
  labels: string[];
  values: number[];
  maxValue: number;
}

export interface SequenceDisplay {
  dimension: string;
  label: string;
  value: number;
  color: string;
  position: string;
}
