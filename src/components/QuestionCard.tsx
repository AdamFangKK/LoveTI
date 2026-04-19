import { motion } from 'framer-motion';
import { useQuizStore } from '../stores/quizStore';
import OptionButton from './OptionButton';
import questionsData from '../data/questions.json';
import type { Dimension } from '../engine/types';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function QuestionCard() {
  const {
    currentQuestionIndex,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    calculateResult,
    getAnswerForCurrentQuestion,
    getProgress,
  } = useQuizStore();

  const question = questionsData.questions[currentQuestionIndex];
  const selectedAnswer = getAnswerForCurrentQuestion();
  const shuffledKeys = shuffleArray(['A', 'B', 'C', 'D'] as Dimension[]);
  const isLastQuestion = currentQuestionIndex === questionsData.questions.length - 1;
  const isComplete = getProgress() === 1;

  const handleNext = () => {
    if (isLastQuestion && isComplete) {
      calculateResult();
    } else {
      nextQuestion();
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 glass-shadow">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            {currentQuestionIndex + 1} / {questionsData.questions.length}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-white/30 text-gray-600">
            {question.lifePhase === 'firstMeet' && '初遇'}
            {question.lifePhase === 'passion' && '热恋'}
            {question.lifePhase === 'conflict' && '冲突'}
            {question.lifePhase === 'stable' && '平淡'}
            {question.lifePhase === 'distance' && '异地'}
            {question.lifePhase === 'longTerm' && '长期'}
          </span>
        </div>

        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <h2 className="text-xl font-medium text-gray-800 mb-6">
            {question.content}
          </h2>

          <div className="space-y-3">
            {shuffledKeys.map((key, i) => (
              <motion.div
                key={`${question.id}-${key}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
              >
                <OptionButton
                  optionKey={key}
                  text={question.options[key].text}
                  isSelected={selectedAnswer === key}
                  onClick={() => selectAnswer(key)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          className="flex-1 py-3 rounded-2xl glass-button disabled:opacity-30 disabled:cursor-not-allowed text-gray-600"
        >
          上一题
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedAnswer}
          className="flex-1 py-3 rounded-2xl primary-gradient text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLastQuestion ? (isComplete ? '查看结果' : '下一题') : '下一题'}
        </button>
      </div>
    </div>
  );
}
