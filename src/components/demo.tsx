
import { Mail, Globe, Navigation, Link } from 'lucide-react';
import { MinimalistHero } from '@/components/ui/minimalist-hero'; // Adjust the import path as needed

const MinimalistHeroDemo = () => {
  const navLinks = [
    { label: 'HOME', href: '#' },
    { label: 'PRODUCT', href: '#' },
    { label: 'STORE', href: '#' },
    { label: 'ABOUT US', href: '#' },
  ];

  const socialLinks = [
    { icon: Mail, href: '#' },
    { icon: Globe, href: '#' },
    { icon: Navigation, href: '#' },
    { icon: Link, href: '#' },
  ];

  return (
    <MinimalistHero
      logoText="AT"
      navLinks={navLinks}
      mainText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultrices, justo vel tempus."
      readMoreLink="#"
      imageSrc="https://plus.unsplash.com/premium_photo-1678197937465-bdbc4ed95815?q=80&w=600&auto=format&fit=crop"
      imageAlt="A portrait of a person."
      overlayText={{
        part1: 'less is',
        part2: 'more.',
      }}
      socialLinks={socialLinks}
      locationText="Arlington Heights, IL"
    />
  );
};

export default MinimalistHeroDemo;
