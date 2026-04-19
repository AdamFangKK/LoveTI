import { motion } from 'framer-motion';
import type { Dimension } from '../engine/types';

interface OptionButtonProps {
  optionKey: Dimension;
  text: string;
  isSelected: boolean;
  onClick: () => void;
}

const dimensionColors: Record<Dimension, string> = {
  A: 'border-rose-200 bg-rose-50/50',
  B: 'border-orange-200 bg-orange-50/50',
  C: 'border-emerald-200 bg-emerald-50/50',
  D: 'border-blue-200 bg-blue-50/50',
};

const selectedColors: Record<Dimension, string> = {
  A: 'border-rose-400 bg-rose-100',
  B: 'border-orange-400 bg-orange-100',
  C: 'border-emerald-400 bg-emerald-100',
  D: 'border-blue-400 bg-blue-100',
};

export default function OptionButton({ optionKey, text, isSelected, onClick }: OptionButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`
        w-full p-4 rounded-2xl text-left
        border-2 backdrop-blur-sm
        transition-all duration-200 ease-out
        ${isSelected
          ? `${selectedColors[optionKey]} border-opacity-100`
          : `${dimensionColors[optionKey]} border-opacity-50 hover:border-opacity-80`
        }
      `}
    >
      <div className="flex items-start gap-3">
        <span className={`
          flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium
          ${isSelected
            ? 'bg-dynamic-orange text-white'
            : 'bg-white/50 text-gray-500'
          }
        `}>
          {optionKey}
        </span>
        <span className={`text-gray-700 ${isSelected ? 'font-medium' : ''}`}>
          {text}
        </span>
      </div>
    </motion.button>
  );
}
