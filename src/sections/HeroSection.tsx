
import { Mail, Globe, Link } from 'lucide-react';
import { MinimalistHero } from '@/components/ui/minimalist-hero';
import ashishPic from '@/assets/ashish pic.svg';

export const HeroSection = () => {
  const navLinks = [
    { label: 'HOME', href: '#hero' },
    { label: 'PRODUCT', href: '#product' },
    { label: 'STORE', href: '#store' },
    { label: 'ABOUT US', href: '#about' },
  ];

  const socialLinks = [
    { icon: Mail, href: '#' },
    { icon: Globe, href: '#' },
    { icon: Link, href: '#' },
  ];

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden bg-black">
      <div className="relative z-10 w-full h-full">
        <MinimalistHero
          logoText="AT"
          navLinks={navLinks}
          mainText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultrices, justo vel tempus."
          readMoreLink="#"
          imageSrc={ashishPic}
          imageAlt="Aashish Thorat Portrait"
          socialLinks={socialLinks}
          locationText="Arlington Heights, IL"
          className="bg-transparent"
        />
      </div>
    </section>
  );
};
