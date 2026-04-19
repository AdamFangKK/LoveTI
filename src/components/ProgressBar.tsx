import { motion } from 'framer-motion';
import { useQuizStore } from '../stores/quizStore';

export default function ProgressBar() {
  const { getProgress } = useQuizStore();
  const progress = getProgress();

  return (
    <div className="relative">
      <div className="h-2 rounded-full bg-white/30 backdrop-blur-sm overflow-hidden">
        <motion.div
          className="h-full rounded-full primary-gradient"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-500">
          {Math.round(progress * 100)}% 完成
        </span>
        <span className="text-xs text-gray-400">
          52 道题
        </span>
      </div>
    </div>
  );
}
