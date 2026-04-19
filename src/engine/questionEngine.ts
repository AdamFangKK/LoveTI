export type Dimension = 'A' | 'B' | 'C' | 'D';
export type LifePhase = 'firstMeet' | 'passion' | 'conflict' | 'stable' | 'distance' | 'longTerm';

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

export interface QuestionEngine {
  questions: Question[];
  answers: Answer[];
  currentQuestionIndex: number;
}

export function createQuestionEngine(questionsData: { questions: Question[] }): QuestionEngine {
  return {
    questions: questionsData.questions,
    answers: [],
    currentQuestionIndex: 0,
  };
}

export function recordAnswer(
  engine: QuestionEngine,
  questionId: number,
  dimension: Dimension
): QuestionEngine {
  const existingIndex = engine.answers.findIndex(a => a.questionId === questionId);
  const newAnswer: Answer = { questionId, dimension };

  return {
    ...engine,
    answers: existingIndex >= 0
      ? engine.answers.map((a, i) => i === existingIndex ? newAnswer : a)
      : [...engine.answers, newAnswer],
  };
}

export function getCurrentQuestion(engine: QuestionEngine): Question | null {
  return engine.questions[engine.currentQuestionIndex] || null;
}

export function nextQuestion(engine: QuestionEngine): QuestionEngine {
  return {
    ...engine,
    currentQuestionIndex: Math.min(engine.currentQuestionIndex + 1, engine.questions.length - 1),
  };
}

export function previousQuestion(engine: QuestionEngine): QuestionEngine {
  return {
    ...engine,
    currentQuestionIndex: Math.max(engine.currentQuestionIndex - 1, 0),
  };
}

export function isComplete(engine: QuestionEngine): boolean {
  return engine.answers.length === engine.questions.length;
}

export function getProgress(engine: QuestionEngine): number {
  return engine.answers.length / engine.questions.length;
}

export function getAnswerForQuestion(engine: QuestionEngine, questionId: number): Dimension | null {
  const answer = engine.answers.find(a => a.questionId === questionId);
  return answer?.dimension || null;
}
