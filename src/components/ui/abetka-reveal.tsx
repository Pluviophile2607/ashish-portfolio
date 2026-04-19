import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { EtherealShadow } from './etheral-shadow';

// IMPORTANT: Register plugin before usage
if (CustomEase) {
  gsap.registerPlugin(CustomEase);
  try {
    CustomEase.create('hop', 'M0,0 C0.34,1.4,0.64,1,1,1');
  } catch (e) {
    console.warn('CustomEase.create failed:', e);
  }
} else {
  console.error('CustomEase module not found!');
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const TOTAL_INTRO = 8;
const TOTAL_OUTRO = 5;

const INTRO_IMAGES = [
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500&q=85',
  'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=500&q=85',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=85',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&q=85',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&q=85',
  'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=500&q=85',
  'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=500&q=85',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=85',
];

const OUTRO_IMAGES = [
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500&q=85',
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&q=85',
  'https://images.unsplash.com/photo-1608508644127-ba99d7732fee?w=500&q=85',
  'https://images.unsplash.com/photo-1632184078-a3a3b21e4588?w=500&q=85',
  'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=500&q=85',
];

function getScatterPositions(W: number, H: number, cardW: number, cardH: number) {
  const pad = 30;
  return [
    { x: pad + W * 0.03, y: pad + H * 0.04, rotation: -18, scale: 1 },
    { x: W - cardW - pad - W * 0.02, y: pad + H * 0.05, rotation: 14, scale: 1 },
    { x: pad + W * 0.05, y: H - cardH - pad - H * 0.04, rotation: -10, scale: 1 },
    { x: W - cardW - pad - W * 0.04, y: H - cardH - pad - H * 0.06, rotation: 20, scale: 1 },
    { x: W * 0.42, y: H * 0.08, rotation: -5, scale: 1 },
  ];
}

interface AbetkaRevealProps {
  onComplete: () => void;
}

export default function AbetkaReveal({ onComplete }: AbetkaRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const introRefs = useRef<(HTMLDivElement | null)[]>([]);
  const outroRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = W / 2;
    const cy = H / 2;

    const cardW = Math.min(150, Math.max(90, W * 0.11));
    const cardH = cardW * 1.4;
    const radius = Math.min(W, H) * 0.36;

    // Filter refs safely
    const intro = introRefs.current.slice(0, TOTAL_INTRO).filter(Boolean) as HTMLDivElement[];
    const outro = outroRefs.current.slice(0, TOTAL_OUTRO).filter(Boolean) as HTMLDivElement[];

    if (intro.length === 0) return;

    const introPositions = intro.map((_, i) => {
      const angle = (i / TOTAL_INTRO) * Math.PI * 2 - Math.PI / 2;
      return {
        x: cx + Math.cos(angle) * radius - cardW / 2,
        y: cy + Math.sin(angle) * radius - cardH / 2,
        rotation: ((angle * 180) / Math.PI) + 90,
        dx: Math.cos(angle),
        dy: Math.sin(angle),
      };
    });

    const firstPos = introPositions[0];

    // INITIAL SETUP
    gsap.set(intro, {
      width: cardW,
      height: cardH,
      x: cx - cardW / 2,
      y: cy - cardH / 2,
      scale: 0,
      opacity: 0,
      rotation: 0,
      borderRadius: 12,
      zIndex: (i) => i + 10,
    });

    gsap.set(outro, {
      width: cardW,
      height: cardH,
      x: firstPos?.x || cx - cardW / 2,
      y: firstPos?.y || cy - cardH / 2,
      opacity: 0,
      scale: 1,
      rotation: firstPos?.rotation || 0,
      borderRadius: 12,
      zIndex: (i) => 50 + i,
    });



    const scatter = getScatterPositions(W, H, cardW, cardH);

    // TIMELINE
    const tl = gsap.timeline({
      delay: 0.5, // Slight delay to ensure everything is ready
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete,
        });
      },
    });

    tl.to(intro, {
      x: (i) => introPositions[i].x,
      y: (i) => introPositions[i].y,
      rotation: (i) => introPositions[i].rotation,
      opacity: 1,
      scale: 1,
      duration: 1.0,
      stagger: 0.08,
      ease: 'back.out(1.6)',
    });

    tl.addLabel('peak', '+=0.55');

    tl.to(intro, {
      x: (i) => introPositions[i].x + introPositions[i].dx * W * 1.1,
      y: (i) => introPositions[i].y + introPositions[i].dy * H * 1.1,
      opacity: 0,
      scale: 0.7,
      duration: 0.65,
      stagger: 0.04,
      ease: 'power3.in',
    }, 'peak');

    tl.set(outro, { opacity: 1 }, 'peak+=0.05');

    tl.to(outro, {
      x: (i) => scatter[i].x,
      y: (i) => scatter[i].y,
      rotation: (i) => scatter[i].rotation,
      scale: (i) => scatter[i].scale,
      duration: 1.1,
      stagger: 0.09,
      ease: 'hop',
    }, 'peak+=0.12');



    tl.to(outro, {
      opacity: 0,
      scale: 0.92,
      duration: 0.7,
      stagger: 0.06,
      ease: 'power2.in',
    }, 'peak+=1.8');

    return () => {
      tl.kill();
    };
  }, []); // Run once on mount

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black overflow-hidden select-none"
    >
      <div className="absolute inset-0 pointer-events-none opacity-50 z-0">
        <EtherealShadow
          color="rgba(220, 20, 60, 0.4)" 
          animation={{ scale: 100, speed: 90 }}
          noise={{ opacity: 1, scale: 1.2 }}
          sizing="fill"
        />
      </div>



      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <p className="text-[10px] tracking-[0.5em] text-white/20 font-medium uppercase">DIGITAL STORYTELLER</p>
      </div>

      {INTRO_IMAGES.map((src, i) => (
        <div
          key={`intro-${i}`}
          ref={(el) => { introRefs.current[i] = el; }}
          className="absolute overflow-hidden shadow-2xl bg-white/5"
          style={{ willChange: 'transform, opacity' }}
        >
          <img src={src} alt="" className="w-full h-full object-cover" draggable={false} />
          <div className="absolute inset-0 bg-black/15" />
        </div>
      ))}

      {OUTRO_IMAGES.map((src, i) => (
        <div
          key={`outro-${i}`}
          ref={(el) => { outroRefs.current[i] = el; }}
          className="absolute overflow-hidden shadow-2xl bg-white/5"
          style={{ willChange: 'transform, opacity' }}
        >
          <img src={src} alt="" className="w-full h-full object-cover" draggable={false} />
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
            <span className="text-[8px] text-white/70 font-bold tracking-widest uppercase">0{i + 1}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
