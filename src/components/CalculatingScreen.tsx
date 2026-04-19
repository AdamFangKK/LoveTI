import { motion } from 'framer-motion';

export default function CalculatingScreen() {
  return (
    <div className="glass-card p-12 text-center glass-shadow">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-dynamic-orange/30 border-t-dynamic-orange flex items-center justify-center"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-dynamic-orange to-pink-400" />
      </motion.div>

      <motion.h2
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-xl font-medium text-gray-700 mb-2"
      >
        分析你的浪漫密码
      </motion.h2>

      <p className="text-sm text-gray-500">
        正在计算 A/B/C/D 全序列...
      </p>

      <div className="mt-8 flex justify-center gap-2">
        {['A', 'B', 'C', 'D'].map((dim, i) => (
          <motion.div
            key={dim}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: ['#FFB4A2', '#FF8C42', '#7EB77F', '#4A90D9'][i],
            }}
          />
        ))}
      </div>
    </div>
  );
}
