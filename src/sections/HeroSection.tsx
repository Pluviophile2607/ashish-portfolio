
import { MinimalistHero } from '@/components/ui/minimalist-hero';
import CircularText from '@/components/ui/circular-text';
import { BlurFade } from '@/components/ui/blur-fade';
import ashishPic from '@/assets/ashish pic.svg';

export const HeroSection = () => {
  console.log("HeroSection Rendering Check - BlurFade should be active");
  
  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden bg-black">
      {/* Floating circular text badge */}
      <div className="absolute bottom-10 right-10 z-50 pointer-events-auto scale-50 md:scale-75 lg:scale-100 mix-blend-difference">
        <BlurFade delay={1.5} yOffset={0} blur="10px">
          <CircularText
            text="THIS IS ASHISH THORAT * "
            onHover="speedUp"
            spinDuration={20}
            className="text-white/20 hover:text-white/80 transition-colors"
          />
        </BlurFade>
      </div>

      <div className="relative z-10 w-full h-full">
        <MinimalistHero
          mainText="I am a digital storyteller dedicated to crafting cinematic experiences through graphic design and high-end video editing."
          imageSrc={ashishPic}
          imageAlt="Aashish Thorat Portrait"
          overlayText={{ part1: "Graphic", part2: "Designer" }}
          className="bg-transparent"
        />
      </div>
    </section>
  );
};
