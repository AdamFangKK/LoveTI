import { useMemo } from 'react';
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

  // ABCD keys stay in fixed order (for labels), only content is shuffled
  // useMemo ensures shuffle is stable within the same session for this question
  const shuffledContent = useMemo(() => {
    // 提取原始内容+维度对
    const contentDimensionPairs = ['A', 'B', 'C', 'D'].map(pos => ({
      dimension: question.options[pos].dimension,
      text: question.options[pos].text
    }));

    // 打乱内容（但维度也跟着内容走）
    const shuffled = shuffleArray(contentDimensionPairs);

    // 分配到固定的position上：A永远在第1行，B永远在第2行...
    return ['A', 'B', 'C', 'D'].map((pos, i) => ({
      position: pos as Dimension,  // 固定标签
      dimension: shuffled[i].dimension,  // 内容绑定的原始维度
      text: shuffled[i].text  // 内容
    }));
  }, [question.id]);

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
            {shuffledContent.map((item, i: number) => (
              <motion.div
                key={`${question.id}-${item.position}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
              >
                <OptionButton
                  optionKey={item.position}
                  text={item.text}
                  isSelected={
                    // 通过反向映射：找到selectedAnswer(dimension)当前在哪个position
                    shuffledContent.find(item => item.dimension === selectedAnswer)?.position === item.position
                  }
                  onClick={() => selectAnswer(item.dimension)}
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
