import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import ImageTrail from "./image-trail";

// Define the props interface for type safety and reusability
interface MinimalistHeroProps {
  logoText: string;
  navLinks: { label: string; href: string }[];
  mainText: string;
  readMoreLink: string;
  imageSrc: string;
  imageAlt: string;
  socialLinks: { icon: LucideIcon; href: string }[];
  locationText: string;
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

// Helper component for navigation links
const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    className="text-sm font-medium tracking-widest text-foreground/60 transition-colors hover:text-foreground"
  >
    {children}
  </a>
);

// Helper component for social media icons
const SocialIcon = ({
  href,
  icon: Icon,
}: {
  href: string;
  icon: LucideIcon;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-foreground/60 transition-colors hover:text-foreground"
  >
    <Icon className="h-5 w-5" />
  </a>
);

// The main reusable Hero Section component
export const MinimalistHero = ({
  logoText,
  navLinks,
  mainText,
  readMoreLink,
  imageSrc,
  imageAlt,
  socialLinks,
  locationText,
  overlayText,
  className,
}: MinimalistHeroProps) => {
  return (
    <div
      className={cn(
        "relative flex h-screen w-full flex-col items-center justify-between overflow-hidden bg-background p-8 font-sans md:p-12",
        className,
      )}
    >
      {/* Background Trail Effect */}
      <ImageTrail items={trailImages} />

      {/* Header */}
      <header className="z-30 flex w-full max-w-7xl items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-black tracking-tighter"
        >
          {logoText}
        </motion.div>
        <div className="hidden items-center space-x-12 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.label} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </div>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-1 md:hidden"
          aria-label="Open menu"
        >
          <span className="block h-0.5 w-6 bg-foreground"></span>
          <span className="block h-0.5 w-5 bg-foreground"></span>
        </motion.button>
      </header>

      {/* Main Content Area - Realigned for Perfect Visual Impact */}
      <div className="relative z-10 flex w-full flex-grow items-center justify-center overflow-visible">
        {/* Large Background Typography Overlay */}
        {overlayText && (
          <div className="absolute inset-0 z-0 flex select-none flex-col items-center justify-center pointer-events-none overflow-visible">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 0.05, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-[20vw] font-black uppercase tracking-tighter leading-none text-foreground"
            >
              {overlayText.part1}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 0.05, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-[20vw] font-black uppercase tracking-tighter leading-none -mt-[5vw] text-foreground"
            >
              {overlayText.part2}
            </motion.div>
          </div>
        )}
        {/* Left Text Content - Moved to absolute to not interfere with scaling */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="absolute left-8 z-30 hidden flex-col md:flex lg:left-12 xl:left-24"
        >
          <p className="max-w-[180px] text-xs font-medium leading-[2] tracking-wide text-foreground/50">
            {mainText}
          </p>
          <div className="mt-8">
            <a
              href={readMoreLink}
              className="text-[10px] font-black tracking-widest text-foreground border-b border-foreground/30 hover:border-foreground transition-colors pb-1 uppercase"
            >
              Read More
            </a>
          </div>
        </motion.div>

        {/* Center Visual - Portrait + Circle with Normalized Scaling */}
        <div className="relative flex items-center justify-center overflow-visible">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="absolute z-0 aspect-square h-[75vh] max-h-[750px] min-h-[350px] rounded-full bg-[#EAB308] shadow-[0_0_100px_rgba(234,179,8,0.1)] translate-y-4"
          ></motion.div>
          <motion.div
            className="relative z-[1000] flex h-full items-center justify-center overflow-visible"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <motion.img
              src={imageSrc}
              alt={imageAlt}
              className="h-[100vh] max-h-[980px] w-auto object-contain filter grayscale brightness-110 contrast-125"
              initial={{ y: 50 }}
              animate={{ y: -55 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `https://placehold.co/800x1200/eab308/ffffff?text=Portrait`;
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Footer Elements */}
      <footer className="z-30 flex w-full max-w-7xl items-end justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex flex-col space-y-4"
        >
          <div className="flex items-center space-x-6">
            {socialLinks.map((link, index) => (
              <SocialIcon key={index} href={link.href} icon={link.icon} />
            ))}
          </div>
          <div className="text-[9px] font-black tracking-[0.3em] text-foreground/20 uppercase">
            {locationText}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="text-[9px] font-black tracking-widest text-foreground/40 uppercase"
        >
          01 / 04
        </motion.div>
      </footer>
    </div>
  );
};
