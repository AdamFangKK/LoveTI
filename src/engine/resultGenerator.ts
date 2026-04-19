import type { Sequence } from './calculationCore';
import type { Persona } from './types';

export interface PersonaData {
  personas: Persona[];
}

export interface GeneratedResult {
  persona: Persona;
  chartData: ChartData;
  sequenceDisplay: SequenceDisplay[];
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

const DIMENSION_CONFIG = {
  A: { label: '氛围型', color: '#FFB4A2', description: '情感氛围敏感者' },
  B: { label: '刺激型', color: '#FF8C42', description: '新鲜体验追寻者' },
  C: { label: '默契型', color: '#7EB77F', description: '深度默契共鸣者' },
  D: { label: '行动型', color: '#4A90D9', description: '高效行动导向者' },
};

export function findPersona(personas: Persona[], sequence: Sequence): Persona | null {
  return personas.find(p => p.sequence === sequence) || null;
}

export function buildChartData(frequencies: { A: number; B: number; C: number; D: number }): ChartData {
  const labels = ['A', 'B', 'C', 'D'].map(key => DIMENSION_CONFIG[key as keyof typeof DIMENSION_CONFIG].label);
  const values = [frequencies.A, frequencies.B, frequencies.C, frequencies.D];
  const maxValue = Math.max(...values);

  return { labels, values, maxValue };
}

export function buildSequenceDisplay(ranking: string[], frequencies: { A: number; B: number; C: number; D: number }): SequenceDisplay[] {
  return ranking.map((dim, index) => {
    const config = DIMENSION_CONFIG[dim as keyof typeof DIMENSION_CONFIG];
    const positionLabels = ['核心驱动', '表达风格', '兼容属性', '浪漫盲区'];
    return {
      dimension: dim,
      label: config.label,
      value: frequencies[dim as keyof typeof frequencies],
      color: config.color,
      position: positionLabels[index],
    };
  });
}

export function generateResult(
  personasData: PersonaData,
  sequence: Sequence,
  frequencies: { A: number; B: number; C: number; D: number },
  ranking: string[]
): GeneratedResult | null {
  const persona = findPersona(personasData.personas, sequence);

  if (!persona) {
    return null;
  }

  const chartData = buildChartData(frequencies);
  const sequenceDisplay = buildSequenceDisplay(ranking, frequencies);

  return {
    persona,
    chartData,
    sequenceDisplay,
  };
}

export function renderPersonaSummary(result: GeneratedResult): string {
  const { persona, sequenceDisplay } = result;

  const topTags = persona.tags.slice(0, 4).join(' ');

  const coreDriver = sequenceDisplay[0];
  const blindSpot = sequenceDisplay[3];

  return `${persona.name} | ${topTags}

你的核心驱动：${coreDriver.position}——${coreDriver.label}
你的浪漫盲区：${blindSpot.position}——${blindSpot.label}

${persona.loveFilter.perceptionOfLove}`;
}
