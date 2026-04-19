import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Letter animation helper ───────────────────────────────────────────────
interface AnimatedTextProps {
  text: string;
  delay?: number;
  className?: string;
  staggerDelay?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0,
  className = '',
  staggerDelay = 0.04,
}) => {
  const letters = text.split('');
  return (
    <span className={`inline-flex overflow-hidden ${className}`}>
      {letters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: delay + i * staggerDelay,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

// ─── Progress Bar ───────────────────────────────────────────────────────────
const ProgressBar: React.FC<{ duration: number }> = ({ duration }) => (
  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10">
    <motion.div
      className="h-full bg-white"
      initial={{ width: '0%' }}
      animate={{ width: '100%' }}
      transition={{ duration, ease: 'linear' }}
    />
  </div>
);

// ─── Nike-inspired Swoosh SVG ───────────────────────────────────────────────
const Swoosh: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 100 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <motion.path
      d="M 0 30 Q 25 0 60 10 Q 90 18 100 8"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    />
  </svg>
);

// ─── Main Preloader ─────────────────────────────────────────────────────────
const Preloader: React.FC = () => {
  const [phase, setPhase] = useState<'intro' | 'name' | 'tagline'>('intro');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('name'), 600);
    const t2 = setTimeout(() => setPhase('tagline'), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden">

      {/* Background grid — subtle texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* Radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(180,0,0,0.12) 0%, transparent 70%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />

      {/* Swoosh mark */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Swoosh className="w-20 h-8" />
      </motion.div>

      {/* Name */}
      <div className="overflow-hidden mb-3">
        <AnimatePresence>
          {phase !== 'intro' && (
            <AnimatedText
              text="AASHISH THORAT"
              delay={0}
              staggerDelay={0.05}
              className="text-white text-4xl md:text-6xl font-black tracking-[0.25em] uppercase"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Tagline */}
      <div className="overflow-hidden h-[28px] flex items-center">
        <AnimatePresence>
          {phase === 'tagline' && (
            <AnimatedText
              text="DIGITAL STORYTELLER · GRAPHIC DESIGNER"
              delay={0}
              staggerDelay={0.025}
              className="text-white/40 text-[10px] md:text-xs tracking-[0.35em] uppercase"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Divider line */}
      <motion.div
        className="mt-10 h-[1px] bg-white/20"
        initial={{ width: 0 }}
        animate={{ width: '120px' }}
        transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Progress bar at bottom */}
      <ProgressBar duration={2.5} />
    </div>
  );
};

export default Preloader;
