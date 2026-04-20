import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ImageTrail from "./image-trail";
import { BlurFade } from "./blur-fade";

// Define the props interface for type safety and reusability
interface MinimalistHeroProps {
  mainText: string;
  imageSrc: string;
  imageAlt: string;
  overlayText?: {
    part1: string;
    part2: string;
  };
  className?: string;
}

// Trail images - curated for reliability
const trailImages = [
  "https://picsum.photos/id/10/400/300",
  "https://picsum.photos/id/11/400/300",
  "https://picsum.photos/id/12/400/300",
  "https://picsum.photos/id/14/400/300",
  "https://picsum.photos/id/15/400/300",
  "https://picsum.photos/id/16/400/300",
  "https://picsum.photos/id/17/400/300",
  "https://picsum.photos/id/19/400/300",
];

export const MinimalistHero = ({
  mainText,
  imageSrc,
  imageAlt,
  overlayText,
  className,
}: MinimalistHeroProps) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-8 font-sans md:p-12",
        className,
      )}
    >
      {/* Background Trail Effect */}
      <ImageTrail items={trailImages} />

      {/* Main Content Area */}
      <div className="relative z-10 flex w-full flex-col md:flex-row flex-grow items-center justify-center overflow-visible">
        
        {/* Large Background Typography Overlay */}
        {overlayText && (
          <div className="absolute inset-0 z-0 flex select-none flex-col items-center justify-center pointer-events-none overflow-visible">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 0.05, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-[25vw] md:text-[20vw] font-black uppercase tracking-tighter leading-none text-foreground"
            >
              {overlayText.part1}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 0.05, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-[25vw] md:text-[20vw] font-black uppercase tracking-tighter leading-none -mt-[5vw] text-foreground"
            >
              {overlayText.part2}
            </motion.div>
          </div>
        )}

        {/* Text Content - Responsive Layout */}
        <div className="z-30 flex flex-col items-center text-center md:items-start md:text-left md:absolute md:left-8 lg:left-12 xl:left-24 mb-12 md:mb-0">
          <BlurFade delay={0.25}>
            <p className="max-w-[28%] text-xs md:text-base font-medium leading-relaxed tracking-wide text-foreground/50">
              {mainText}
            </p>
          </BlurFade>
        </div>

        {/* Center Visual - Portrait + Circle */}
        <div className="relative flex items-center justify-center overflow-visible">
          
          {/* Background Circle Wrapper - Handles static positioning */}
          <div className="absolute z-0 translate-y-10 md:-translate-x-15 flex items-center justify-center">
            <BlurFade delay={0.1} blur="15px" duration={1} yOffset={20}>
              <div className="aspect-square h-[45vh] md:h-[75vh] max-h-[750px] min-h-[300px] rounded-full bg-[#EAB308] shadow-[0_0_100px_rgba(234,179,8,0.1)]" />
            </BlurFade>
          </div>
          
          {/* Portrait Wrapper - Handles static positioning */}
          <div className="relative z-[1000] md:translate-x-15 flex h-full items-center justify-center overflow-visible">
            <BlurFade delay={0.3} blur="10px" duration={1.2} yOffset={30}>
              <div className="flex h-full items-center justify-center overflow-visible">
                <motion.img
                  src={imageSrc}
                  alt={imageAlt}
                  className="h-[80vh] md:h-[98vh] max-h-[1100px] w-auto object-contain filter grayscale brightness-110 contrast-125"
                  initial={{ y: 50 }}
                  animate={{ y: -5 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `https://placehold.co/800x1200/eab308/ffffff?text=Portrait`;
                  }}
                />
              </div>
            </BlurFade>
          </div>
        </div>

      </div>
    </div>
  );
};
