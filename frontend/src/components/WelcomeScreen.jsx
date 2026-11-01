import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function WelcomeScreen({ isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="simple-welcome-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.01,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F7F7F5] px-6 select-none overflow-hidden"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(201, 154, 74, 0.08) 0%, rgba(247, 247, 245, 0) 70%)',
          }}
          role="status"
          aria-live="polite"
          aria-label="Welcome to your wardrobe"
        >
          <div className="flex flex-col items-center text-center max-w-lg space-y-5 animate-fade-in">
            {/* Minimal Brand Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/80 border border-[#E7E4DF] shadow-subtle"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C99A4A]" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1C1C1C]">
                MyWardrobe
              </span>
            </motion.div>

            {/* Core Welcome Headline */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1C1C1C] leading-tight"
            >
              Welcome to your wardrobe
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xs sm:text-sm text-[#757471] max-w-md font-medium"
            >
              Your digital space for curated fashion, effortless outfit styling, and intelligent wardrobe management.
            </motion.p>

            {/* Luxury Minimal Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-4 flex flex-col items-center space-y-2.5"
            >
              <div className="w-36 sm:w-48 h-1 bg-[#E7E4DF] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#C99A4A] rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.8, ease: 'easeInOut' }}
                />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-[#9E9C98] uppercase">
                Preparing Experience
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

