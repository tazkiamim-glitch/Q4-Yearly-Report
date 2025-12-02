import { motion } from 'framer-motion';
import type { ReportMode } from '../context/StudentDataContext';

interface ReportSelectionScreenProps {
  onSelectMode: (mode: ReportMode) => void;
}

const cardVariants = {
  initial: { opacity: 0, y: 40, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' as const } },
  whileHover: { y: -6, scale: 1.02, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } },
};

export const ReportSelectionScreen = ({ onSelectMode }: ReportSelectionScreenProps) => {
  return (
    <div className="slide-container flex flex-col items-center justify-center px-2 relative">
      <img
        src="/shikho_logo.png"
        alt="Shikho Logo"
        className="absolute z-50 left-1/2 -translate-x-1/2 w-10 h-10 h-sm:w-14 h-sm:h-14 h-md:w-16 h-md:h-16"
        style={{ top: 30 }}
      />

      <div className="gradient-bg" />

      <div className="fixed-dot-indicator">
        {[...Array(7)].map((_, i) => (
          <span key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-shikho-pink' : 'bg-gray-300'} inline-block`} />
        ))}
      </div>

      <div className="card-oval w-[80vw] max-w-[900px] flex flex-col items-center py-6 mb-4 fade-in-slide visible">
        <div className="text-center mb-6 px-4">
          <p className="text-shikho-blue uppercase tracking-[0.3em] text-[10px] md:text-xs mb-2">Choose one</p>
          <h1 className="text-shikho-blue text-base md:text-xl font-semibold font-noto-bengali">এবার কোন রিপোর্ট দেখবে?</h1>
          <p className="text-gray-600 mt-2 text-xs md:text-sm font-noto-bengali">
            ছোট ট্যাব থেকে মোড বেছে নাও।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full px-4 justify-center">
          {[
            { label: 'Quarterly', mode: 'QUARTERLY', border: 'border-[#D6E7FF]', text: 'text-shikho-blue' },
            { label: 'Yearly', mode: 'YEARLY', border: 'border-[#FFE1B6]', text: 'text-amber-700' },
          ].map((tab, idx) => (
          <motion.button
              key={tab.mode}
            type="button"
            variants={cardVariants}
            initial="initial"
            animate="animate"
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            whileHover="whileHover"
            whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMode(tab.mode as ReportMode)}
              className={`flex-1 min-w-[120px] rounded-full border ${tab.border} bg-white py-2 px-3 text-center shadow-sm ${tab.text} text-xs md:text-sm font-medium`}
            >
              {tab.label}
          </motion.button>
          ))}
        </div>
      </div>

      <div className="fixed left-1/2 bottom-16 mb-2 z-30 text-center student-name-display">
        <p className="text-gray-500 font-noto-bengali text-sm">
          তোমার গল্প এখান থেকেই শুরু
        </p>
      </div>
    </div>
  );
};

