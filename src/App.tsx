import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Cursor } from './components/Cursor';
import { Navbar } from './components/Navbar';
import { HeroSection } from './sections/HeroSection';
import GallerySection from './sections/GallerySection';
import AbetkaReveal from './components/ui/abetka-reveal';

import { FooterSection } from './sections/FooterSection';

function App() {
  const [revealDone, setRevealDone] = useState(false);

  return (
    <div className="bg-jet min-h-screen text-white selection:bg-crimson selection:text-white overflow-x-hidden">
      <AnimatePresence mode="popLayout">
        {!revealDone ? (
          <motion.div
            key="reveal"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
          >
            <AbetkaReveal onComplete={() => setRevealDone(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col min-h-screen"
          >
            <Navbar />
            <Cursor />
            <main className="relative z-10 flex flex-col">
              <HeroSection />
              <GallerySection />
              <FooterSection />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
