import { motion, useSpring, useTransform } from 'framer-motion';
import { useQuizStore } from '../stores/quizStore';
import { useEffect, useState } from 'react';

export default function ProgressBar() {
  const { getProgress, currentQuestionIndex } = useQuizStore();
  const progress = getProgress();
  const [isPulsing, setIsPulsing] = useState(false);
  const [prevIndex, setPrevIndex] = useState(currentQuestionIndex);

  // Track question changes to trigger pulse
  useEffect(() => {
    if (currentQuestionIndex > prevIndex) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 600);
      setPrevIndex(currentQuestionIndex);
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, prevIndex]);

  // Spring-animated progress for smooth interpolation
  const springProgress = useSpring(progress, { stiffness: 100, damping: 20 });
  const displayProgress = useTransform(springProgress, [0, 1], [0, 100]);

  // Color phases: 0-30% transparent, 31-70% transitioning, 71-100% glowing
  const getPhaseColor = (p: number) => {
    if (p <= 0.3) {
      // Phase 1: Nearly transparent, barely visible
      return {
        bg: 'rgba(255, 107, 53, 0.15)',
        glow: 'rgba(255, 107, 53, 0)',
        intensity: 0.15
      };
    } else if (p <= 0.7) {
      // Phase 2: Transitioning to orange
      const t = (p - 0.3) / 0.4;
      const intensity = 0.15 + t * 0.5;
      return {
        bg: `rgba(255, 107, 53, ${intensity})`,
        glow: `rgba(255, 107, 53, ${t * 0.3})`,
        intensity
      };
    } else {
      // Phase 3: Glowing and intense
      const t = (p - 0.7) / 0.3;
      const intensity = 0.65 + t * 0.35;
      return {
        bg: `rgba(255, 107, 53, ${intensity})`,
        glow: `rgba(255, 140, 107, ${0.3 + t * 0.5})`,
        intensity
      };
    }
  };

  const phase = getPhaseColor(progress);

  return (
    <div className="relative">
      {/* Glass tube container */}
      <div className="relative h-10 rounded-full overflow-visible">
        {/* Background glass tube */}
        <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm border-[1px] border-white/30 overflow-hidden">
          {/* Inner highlight - top bevel */}
          <div className="absolute top-[1px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full" />
        </div>

        {/* Tick marks - 5 segments for 52 questions */}
        <div className="absolute inset-0 flex justify-between px-[2%]">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="relative w-[1px] h-3 self-center"
            >
              <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                progress > (i + 1) * 0.2
                  ? 'bg-white/60'
                  : 'bg-white/20'
              }`} />
            </div>
          ))}
        </div>

        {/* Liquid fill with wave */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-0 origin-left"
            style={{
              scaleX: displayProgress,
            }}
          >
            {/* Wave layer 1 - primary */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={phase.bg} />
                  <stop offset="50%" stopColor={phase.bg} />
                  <stop offset="100%" stopColor={phase.glow} />
                </linearGradient>
              </defs>
              <path
                d={`
                  M 0,50
                  Q 10,${isPulsing ? 35 : 45} 20,50
                  T 40,50
                  T 60,50
                  T 80,50
                  T 100,50
                  L 100,100
                  L 0,100
                  Z
                `}
                fill="url(#liquidGradient)"
                className="transition-all duration-300"
              />
            </svg>

            {/* Wave layer 2 - secondary ripple */}
            <svg
              className="absolute inset-0 w-full h-full opacity-50"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d={`
                  M 0,50
                  Q 15,${isPulsing ? 40 : 48} 25,50
                  T 50,50
                  T 75,50
                  T 100,50
                  L 100,100
                  L 0,100
                  Z
                `}
                fill={phase.glow}
                className="transition-all duration-500"
              />
            </svg>

            {/* Droplet pulse effect */}
            {isPulsing && (
              <motion.div
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
                style={{ background: phase.glow }}
              />
            )}
          </motion.div>

          {/* Inner glow at high progress */}
          {progress > 0.7 && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: `inset 0 0 20px ${phase.glow}, inset 0 0 40px ${phase.glow}`,
              }}
            />
          )}
        </div>

        {/* Front bubble indicator */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${Math.max(8, Math.min(92, progress * 100))}%`,
            x: '-50%',
          }}
        >
          <motion.div
            animate={{
              y: [0, -3, 0],
              scale: isPulsing ? [1, 1.3, 1] : [1, 1.05, 1],
            }}
            transition={{
              y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 0.3 }
            }}
            className="relative"
          >
            {/* Bubble */}
            <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg">
              <span className="text-[10px] font-medium text-gray-700">
                {Math.round(progress * 100)}%
              </span>
            </div>
            {/* Bubble shine */}
            <div className="absolute -top-[2px] left-[6px] w-2 h-1 rounded-full bg-white/60" />
          </motion.div>
        </motion.div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-3 px-1">
        <span className="text-xs text-gray-500">
          {currentQuestionIndex + 1}/52 题
        </span>
        <span className="text-xs text-gray-400">
          {progress >= 1 ? '即将揭晓' : progress > 0.7 ? '接近尾声' : '继续探索'}
        </span>
      </div>
    </div>
  );
}
