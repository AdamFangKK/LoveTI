import { motion } from 'framer-motion';
import { useQuizStore } from '../stores/quizStore';

export default function StartScreen() {
  const { startQuiz } = useQuizStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 text-center glass-shadow"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-dynamic-orange to-pink-400 flex items-center justify-center"
      >
        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </motion.div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        LoveTI
      </h1>
      <p className="text-gray-600 mb-6">
        恋爱倾向测试
      </p>

      <div className="text-left text-sm text-gray-500 mb-8 space-y-2">
        <p>面向中国 Z 世代的恋爱倾向测试</p>
        <p>51 道中性化题目 · 24 种全序列人格</p>
        <p>发现你的 A/B/C/D 浪漫密码</p>
      </div>

      <motion.button
        onClick={startQuiz}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-2xl primary-gradient text-white font-medium shadow-lg"
      >
        开始测试
      </motion.button>

      <p className="text-xs text-gray-400 mt-4">
        约需 3-5 分钟
      </p>
    </motion.div>
  );
}
