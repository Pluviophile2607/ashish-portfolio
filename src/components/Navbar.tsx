import { motion } from 'framer-motion';

export const Navbar = () => {
  const navLinks = [
    { name: 'HOME', href: '#hero', active: true },
    { name: 'ABOUT', href: '#about' },
    { name: 'WORK', href: '#work' },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-0 w-full z-[999] flex justify-center pointer-events-none"
    >
      <motion.div
        layout
        className="w-[640px] h-[60px] pointer-events-auto backdrop-blur-xl bg-black/60 border border-white/10 rounded-full shadow-2xl flex items-center px-8"
      >
        {/* Content Layer */}
        <div className="w-full flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center">
            <span className="text-white text-xl font-black tracking-tight">AT.</span>
          </div>

          {/* Nav Links */}
          <div className="flex-1 flex justify-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-[10px] font-bold tracking-[0.25em] transition-all duration-300 relative group/link uppercase ${
                  link.active ? 'text-white' : 'text-white/40 hover:text-white'
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {link.active && (
                  <motion.span 
                    layoutId="activeNav"
                    className="absolute -bottom-2 left-0 w-full h-[2px] bg-white" 
                  />
                )}
              </a>
            ))}
          </div>

          {/* Action Button */}
          <div className="flex items-center">
            <button className="h-9 px-6 border border-white/20 rounded-full text-white text-[9px] font-black tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-500">
              Contact
            </button>
          </div>

        </div>
      </motion.div>
    </motion.nav>
  );
};
