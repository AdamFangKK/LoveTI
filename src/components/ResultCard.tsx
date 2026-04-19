import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '../stores/quizStore';
import RadarChart from './RadarChart';
import SequenceBar from './SequenceBar';
import personasData from '../data/personas.json';
import type { Persona } from '../engine/types';

export default function ResultCard() {
  const { persona, chartData, sequenceDisplay, resetQuiz } = useQuizStore();
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  if (!persona || !chartData || !sequenceDisplay) {
    return null;
  }

  const getMatchPersona = (seq: string): Persona | undefined => {
    return personasData.personas.find(p => p.sequence === seq) as Persona | undefined;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="glass-card p-6 glass-shadow text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-dynamic-orange to-pink-400 flex items-center justify-center"
        >
          <span className="text-2xl">✨</span>
        </motion.div>

        <p className="text-sm text-gray-500 mb-1">你的恋爱人格是</p>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          {persona.name}
        </h2>
        <p className="text-sm text-dynamic-orange font-medium">
          序列 #{persona.sequenceRank} · {persona.sequence}
        </p>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {persona.tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="px-3 py-1 rounded-full bg-white/40 text-sm text-gray-600"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="glass-card p-6 glass-shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-4">维度分布</h3>
        <div className="flex justify-center mb-6">
          <RadarChart data={chartData} />
        </div>
        <SequenceBar data={sequenceDisplay} />
      </div>

      <div className="glass-card p-6 glass-shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-2">人格深度分析</h3>
        <div className="bg-gradient-to-br from-orange-50/50 to-pink-50/50 rounded-2xl p-5 border border-orange-100/50">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {persona.loveAnalysis}
          </p>
        </div>
      </div>

      <div className="glass-card p-6 glass-shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-2">恋爱滤镜</h3>
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎨</span>
            <div>
              <p className="text-xs text-gray-500">世界色彩</p>
              <p className="text-gray-700">{persona.loveFilter.worldColor}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">💭</span>
            <div>
              <p className="text-xs text-gray-500">感知方式</p>
              <p className="text-gray-700">{persona.loveFilter.perceptionOfLove}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 glass-shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-2">理想伴侣</h3>
        <div className="flex gap-2 mb-4">
          {persona.perfectMatch.sequences.map((seq) => (
            <button
              key={seq}
              onClick={() => setExpandedMatch(expandedMatch === seq ? null : seq)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${expandedMatch === seq
                  ? 'bg-dynamic-orange text-white'
                  : 'bg-dynamic-orange/10 text-dynamic-orange hover:bg-dynamic-orange/20'
                }
              `}
            >
              {seq} · {getMatchPersona(seq)?.name}
              <span className="ml-1 text-xs opacity-70">
                {expandedMatch === seq ? '▲' : '▼'}
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {expandedMatch && getMatchPersona(expandedMatch) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100/50 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-dynamic-orange/20 to-pink-400/20 flex items-center justify-center">
                    <span className="text-lg">💕</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{getMatchPersona(expandedMatch)?.name}</p>
                    <p className="text-xs text-gray-500">
                      {getMatchPersona(expandedMatch)?.sequence} · #{getMatchPersona(expandedMatch)?.sequenceRank}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {(getMatchPersona(expandedMatch)?.tags || []).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-white/60 text-xs text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="bg-white/60 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">💭 恋爱滤镜</p>
                  <p className="text-sm text-gray-700">
                    {getMatchPersona(expandedMatch)?.loveFilter.worldColor} · {getMatchPersona(expandedMatch)?.loveFilter.perceptionOfLove}
                  </p>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {getMatchPersona(expandedMatch)?.loveAnalysis?.slice(0, 200)}...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100/50">
          <p className="text-sm text-blue-700 leading-relaxed">
            <span className="font-medium">契合逻辑：</span>
            {persona.perfectMatch.reason}
          </p>
        </div>
      </div>

      <div className="glass-card p-6 glass-shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-2">避雷指南</h3>
        <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/50 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-xs text-rose-500 mb-2">浪漫盲区</p>
              <p className="text-gray-700 leading-relaxed">
                {persona.warningSign.blindSpot}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100/50">
          <p className="text-xs text-amber-600 mb-2">⚡ 需特别注意的不合拍类型</p>
          <div className="flex flex-wrap gap-2">
            {persona.warningSign.incompatibleTypes.map((type) => {
              const typePersona = getMatchPersona(type);
              return (
                <span
                  key={type}
                  className="px-3 py-1 rounded-full bg-amber-100/60 text-xs text-amber-700"
                >
                  {type}
                  {typePersona && ` · ${typePersona.name}`}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <motion.button
        onClick={resetQuiz}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-2xl glass-button text-gray-600 font-medium"
      >
        重新测试
      </motion.button>
    </motion.div>
  );
}
