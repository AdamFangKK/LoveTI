import { create } from 'zustand';
import type { Dimension, Answer, Sequence, FrequencyCount, Persona, ChartData, SequenceDisplay } from '../engine/types';
import questionsData from '../data/questions.json';
import personasData from '../data/personas.json';
import { countFrequencies, generateRanking, resolveTieBreaker } from '../engine/calculationCore';

type QuizState = 'idle' | 'loading' | 'answering' | 'calculating' | 'result';

interface QuizStore {
  state: QuizState;
  currentQuestionIndex: number;
  answers: Answer[];
  frequencies: FrequencyCount | null;
  sequence: Sequence | null;
  ranking: Dimension[] | null;
  persona: Persona | null;
  chartData: ChartData | null;
  sequenceDisplay: SequenceDisplay[] | null;

  startQuiz: () => void;
  selectAnswer: (dimension: Dimension) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  calculateResult: () => void;
  resetQuiz: () => void;
  getCurrentQuestion: () => typeof questionsData.questions[0] | null;
  getAnswerForCurrentQuestion: () => Dimension | null;
  getProgress: () => number;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  state: 'idle',
  currentQuestionIndex: 0,
  answers: [],
  frequencies: null,
  sequence: null,
  ranking: null,
  persona: null,
  chartData: null,
  sequenceDisplay: null,

  startQuiz: () => {
    set({ state: 'answering', currentQuestionIndex: 0, answers: [] });
  },

  selectAnswer: (dimension: Dimension) => {
    const { currentQuestionIndex, answers } = get();
    const questionId = questionsData.questions[currentQuestionIndex].id;

    const existingIndex = answers.findIndex(a => a.questionId === questionId);
    const newAnswer: Answer = { questionId, dimension };

    const newAnswers = existingIndex >= 0
      ? answers.map((a, i) => i === existingIndex ? newAnswer : a)
      : [...answers, newAnswer];

    set({ answers: newAnswers });
  },

  nextQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex < questionsData.questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  calculateResult: () => {
    set({ state: 'calculating' });

    const { answers } = get();
    const frequencies = countFrequencies(answers);
    const ranking = generateRanking(frequencies);
    const sequence = resolveTieBreaker(ranking as Dimension[], frequencies);

    const persona = personasData.personas.find(p => p.sequence === sequence) as Persona | null;

    const chartData = {
      labels: ['氛围型', '刺激型', '默契型', '行动型'],
      values: [frequencies.A, frequencies.B, frequencies.C, frequencies.D],
      maxValue: Math.max(frequencies.A, frequencies.B, frequencies.C, frequencies.D),
    };

    const dimensionColors: Record<string, string> = {
      A: '#FFB4A2',
      B: '#FF8C42',
      C: '#7EB77F',
      D: '#4A90D9',
    };

    const positionLabels = ['核心驱动', '表达风格', '兼容属性', '浪漫盲区'];

    const sequenceDisplay: SequenceDisplay[] = (ranking as Dimension[]).map((dim, index) => ({
      dimension: dim,
      label: ['氛围型', '刺激型', '默契型', '行动型'][['A', 'B', 'C', 'D'].indexOf(dim)],
      value: frequencies[dim],
      color: dimensionColors[dim],
      position: positionLabels[index],
    }));

    setTimeout(() => {
      set({
        state: 'result',
        frequencies,
        sequence,
        ranking,
        persona,
        chartData,
        sequenceDisplay,
      });
    }, 1500);
  },

  resetQuiz: () => {
    set({
      state: 'idle',
      currentQuestionIndex: 0,
      answers: [],
      frequencies: null,
      sequence: null,
      ranking: null,
      persona: null,
      chartData: null,
      sequenceDisplay: null,
    });
  },

  getCurrentQuestion: () => {
    const { currentQuestionIndex } = get();
    return questionsData.questions[currentQuestionIndex] || null;
  },

  getAnswerForCurrentQuestion: () => {
    const { currentQuestionIndex, answers } = get();
    const questionId = questionsData.questions[currentQuestionIndex]?.id;
    return answers.find(a => a.questionId === questionId)?.dimension || null;
  },

  getProgress: () => {
    const { answers } = get();
    return answers.length / questionsData.questions.length;
  },
}));
