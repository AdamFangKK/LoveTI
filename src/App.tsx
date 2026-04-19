import { useQuizStore } from './stores/quizStore';
import { AnimatePresence, motion } from 'framer-motion';
import QuestionCard from './components/QuestionCard';
import ProgressBar from './components/ProgressBar';
import ResultCard from './components/ResultCard';
import StartScreen from './components/StartScreen';
import CalculatingScreen from './components/CalculatingScreen';

function FloatingParticles() {
  return (
    <div className="floating-particles">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="floating-particle" />
      ))}
    </div>
  );
}

function App() {
  const { state } = useQuizStore();

  return (
    <div className="min-h-screen bg-gradient-animated flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingParticles />

      <div className="w-full max-w-lg relative z-10">
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <StartScreen />
            </motion.div>
          )}

          {(state === 'answering') && (
            <motion.div
              key="answering"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <ProgressBar />
              <QuestionCard />
            </motion.div>
          )}

          {state === 'calculating' && (
            <motion.div
              key="calculating"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <CalculatingScreen />
            </motion.div>
          )}

          {state === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ResultCard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
