import { motion } from 'framer-motion';

interface SequenceDisplay {
  dimension: string;
  label: string;
  value: number;
  color: string;
  position: string;
}

interface SequenceBarProps {
  data: SequenceDisplay[];
}

export default function SequenceBar({ data }: SequenceBarProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <motion.div
          key={item.dimension}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-1"
        >
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: item.color }}
              >
                {item.dimension}
              </span>
              <span className="text-gray-700">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{item.position}</span>
              <span className="text-gray-600 font-medium">{item.value}题</span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / maxValue) * 100}%` }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: item.color }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
