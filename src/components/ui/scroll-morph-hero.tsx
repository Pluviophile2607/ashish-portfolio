import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type AnimationPhase = "scatter" | "line" | "circle";

interface FlipCardProps {
  src: string;
  index: number;
  total: number;
  morphProgress: number;
  stackProgress: number;
  exitOpacity: number;
  containerSize: { width: number; height: number };
  introPhase: AnimationPhase;
  scatterPos: { x: number; y: number; rotation: number; scale: number };
}

const IMG_WIDTH = 60;
const IMG_HEIGHT = 85;
const TOTAL_IMAGES = 20;

const IMAGES = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=300&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=80",
  "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=300&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&q=80",
  "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=300&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80",
  "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=300&q=80",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&q=80",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=300&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=300&q=80",
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=300&q=80",
  "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=300&q=80",
  "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=300&q=80",
  "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=300&q=80",
  "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=300&q=80",
];

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const ratio = (value - inMin) / (inMax - inMin);
  return outMin + ratio * (outMax - outMin);
}

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

function FlipCard({
  src,
  index,
  total,
  morphProgress,
  stackProgress,
  exitOpacity,
  containerSize,
  introPhase,
  scatterPos,
}: FlipCardProps) {
  let x = 0;
  let y = 0;
  let rotation = 0;
  let scale = 1;

  if (introPhase === "scatter") {
    x = scatterPos.x;
    y = scatterPos.y;
    rotation = scatterPos.rotation;
    scale = scatterPos.scale;
  } else if (introPhase === "line") {
    const lineSpacing = 100;
    x = index * lineSpacing - (total * lineSpacing) / 2;
  } else {
    const isMobile = containerSize.width < 768;
    const minDim = Math.min(containerSize.width, containerSize.height);
    const lineSpacing = 100;
    const lineX = index * lineSpacing - (total * lineSpacing) / 2;
    const circleRadius = Math.min(minDim * 0.47, 460);
    const circleAngle = (index / total) * 360;
    const circleRad = (circleAngle * Math.PI) / 180;
    const circleX = Math.cos(circleRad) * circleRadius;
    const circleY = Math.sin(circleRad) * circleRadius;
    const circleRotation = circleAngle + 90;
    const circleScale = 1;
    const lineScale = 0.95;

    const stackSpacing = isMobile ? 34 : 40;
    const stackY = (index - total / 2) * stackSpacing - stackProgress * total * (stackSpacing * 0.35);
    const morphX = lerp(lineX, circleX, morphProgress);
    const morphY = lerp(0, circleY, morphProgress);
    const morphRotation = lerp(0, circleRotation, morphProgress);
    const morphScale = lerp(lineScale, circleScale, morphProgress);

    x = lerp(morphX, 0, stackProgress);
    y = lerp(morphY, stackY, stackProgress);
    rotation = lerp(morphRotation, 0, stackProgress);
    scale = lerp(morphScale, isMobile ? 1.05 : 1.15, stackProgress);
  }

  const opacity = clamp(exitOpacity - index * 0.012, 0, 1);

  return (
    <motion.div
      style={{
        opacity,
        position: "absolute",
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(${scale})`,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="group cursor-pointer will-change-transform"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl bg-gray-200 shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img src={src} alt={`card-${index}`} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
        </div>
        <div
          className="absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-700 bg-gray-900 p-4 shadow-lg"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="mb-1 text-[8px] font-bold uppercase tracking-widest text-blue-400">View</p>
          <p className="text-xs font-medium text-white">Details</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ScrollMorphHero() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");

  useEffect(() => {
    if (!innerRef.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });

    observer.observe(innerRef.current);
    setContainerSize({ width: innerRef.current.offsetWidth, height: innerRef.current.offsetHeight });

    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!outerRef.current || !innerRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: outerRef.current,
        start: "top top",
        end: "+=240%",
        pin: innerRef.current,
        scrub: 0.9,
        anticipatePin: 1,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, outerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const t1 = window.setTimeout(() => setIntroPhase("line"), 350);
    const t2 = window.setTimeout(() => setIntroPhase("circle"), 1200);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  const scatterPositions = useMemo(
    () =>
      IMAGES.map(() => ({
        x: (Math.random() - 0.5) * 1500,
        y: (Math.random() - 0.5) * 1000,
        rotation: (Math.random() - 0.5) * 180,
        scale: 0.55,
      })),
    [],
  );

  const morphProgress = clamp(mapRange(scrollProgress, 0.07, 0.42, 0, 1));
  const stackProgress = clamp(mapRange(scrollProgress, 0.42, 0.75, 0, 1));
  const exitOpacity = 1 - clamp(mapRange(scrollProgress, 0.78, 0.97, 0, 1));
  const introOpacity = 1 - clamp(mapRange(scrollProgress, 0.02, 0.18, 0, 1));
  const contentOpacity = clamp(mapRange(morphProgress, 0.6, 0.9, 0, 1)) * exitOpacity;
  const contentY = lerp(24, -12, clamp(mapRange(morphProgress, 0.6, 1, 0, 1)));
  const footerRevealProgress = clamp(mapRange(scrollProgress, 0.8, 1, 0, 1));
  const revealLift = footerRevealProgress * 22;
  const revealRadius = footerRevealProgress * 36;

  return (
    <div ref={outerRef} className="relative bg-black">
      <div
        ref={innerRef}
        className="relative h-screen w-full overflow-hidden bg-black"
        style={{ perspective: "1000px" }}
      >
        <div
          className="relative flex h-full w-full flex-col items-center justify-center"
          style={{
            transform: `translateY(-${revealLift}vh) scale(${1 - footerRevealProgress * 0.03})`,
            borderRadius: `${revealRadius}px`,
            boxShadow: footerRevealProgress > 0 ? "0 20px 80px rgba(0,0,0,0.45)" : "none",
            transformOrigin: "center top",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-[#050505] to-black" />

          <motion.div
            className="pointer-events-none absolute z-10 flex flex-col items-center justify-center text-center"
            style={{ opacity: introOpacity }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={introPhase === "circle" ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.9 }}
              className="text-2xl font-medium tracking-tight text-white md:text-4xl"
            >
              Sample of my work
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={introPhase === "circle" ? { opacity: 0.6 } : {}}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-white/60"
            >
              SCROLL TO EXPLORE
            </motion.p>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute top-[10%] z-20 mt-20 flex flex-col items-center justify-center px-4 text-center"
            style={{ opacity: contentOpacity, y: contentY }}
          >
            <h2 className="mb-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Explore Our Vision
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-white/70 md:text-base">
              Discover a world where technology meets creativity.
              <br className="hidden md:block" />
              Scroll through our curated collection.
            </p>
          </motion.div>

          <div className="relative z-30 flex h-full w-full items-center justify-center">
            {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => (
              <FlipCard
                key={i}
                src={src}
                index={i}
                total={TOTAL_IMAGES}
                morphProgress={morphProgress}
                stackProgress={stackProgress}
                exitOpacity={exitOpacity}
                containerSize={containerSize}
                introPhase={introPhase}
                scatterPos={scatterPositions[i]}
              />
            ))}
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/70 to-transparent"
            style={{ opacity: clamp(0.35 + footerRevealProgress * 0.65) }}
          />
        </div>
      </div>
    </div>
  );
}
