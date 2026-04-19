import { motion } from 'framer-motion';

export const Navbar = () => {
  const navLinks = [
    { name: 'HOME', href: '#hero', active: true },
    { name: 'ABOUT', href: '#about' },
    { name: 'WORK', href: '#work' },
    { name: 'CONTACT', href: '#contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-[999] pt-6 bg-[#EAB308]"
    >
      <div className="max-w-[1400px] mx-auto relative h-[84px] px-8">
        
        {/* Clean Background SVG Design */}
        <div className="absolute inset-0 z-0 drop-shadow-lg">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1200 84"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Unified Path for Black Background with Cutout */}
            <path
              d="M 12 0 
                 H 300
                 Q 320 0 320 20
                 V 25
                 Q 320 44 340 44
                 H 860
                 Q 880 44 880 25
                 V 20
                 Q 880 0 900 0
                 H 1188
                 Q 1200 0 1200 12
                 V 84
                 H 0
                 V 12
                 Q 0 0 12 0 Z"
              fill="#000000ff"
            />
            
            {/* Rounded Recessed Bar (Yellow) */}
            <rect 
              x="320" 
              y="0" 
              width="560" 
              height="44" 
              rx="22" 
              fill="#EAB308" 
            />
          </svg>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 w-full h-[40px] flex items-center justify-between">
          
          {/* Brand - Centered in Left Tab with padding */}
          <div className="w-[180px] flex justify-start pt-8">
            <span className="text-[#F5F5F0] text-xl font-black tracking-tight">AT.</span>
          </div>

          {/* Nav - Centered in Cream Bar with reduced internal padding */}
          <div className="flex-1 flex justify-center space-x-12 px-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-[11px] font-bold tracking-[0.25em] transition-all duration-300 relative group/link uppercase ${
                  link.active ? 'text-[#0A0A0A]' : 'text-[#0A0A0A]/40 hover:text-[#0A0A0A]'
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {link.active && (
                  <motion.span 
                    layoutId="activeNav"
                    className="absolute -bottom-2 left-0 w-full h-[2.5px] bg-[#C41230]" 
                  />
                )}
                {!link.active && (
                  <span className="absolute -bottom-2 left-0 w-0 h-[2.5px] bg-[#0A0A0A]/20 transition-all duration-300 group-hover/link:w-full" />
                )}
              </a>
            ))}
          </div>

          {/* Action - Centered in Right Tab with padding */}
          <div className="w-[180px] flex justify-end pt-8">
            <button className="h-9 px-8 border border-[#F5F5F0]/20 rounded-full text-[#F5F5F0] text-[10px] font-black tracking-widest uppercase hover:bg-[#F5F5F0] hover:text-[#0A0A0A] transition-all duration-500">
              Contact
            </button>
          </div>

        </div>
      </div>
    </motion.nav>
  );
};
