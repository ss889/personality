import { FC } from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {}

export const Header: FC<HeaderProps> = () => {
  const navItems = [
    { label: 'Home', href: '#home-hero' },
    { label: 'Personality Types', href: '#personality-types' },
    { label: 'Teams', href: '#teams' },
    { label: 'Resources', href: '#resources' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100/80">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a
            href="#home-hero"
            className="text-2xl font-bold bg-gradient-to-r from-vibrant-purple to-vibrant-pink bg-clip-text text-transparent"
          >
            ∞ Spark
          </a>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Login Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            document
              .querySelector('#personality-types')
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="px-6 py-2 bg-gradient-to-r from-vibrant-purple to-vibrant-pink text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.6),0_0_40px_rgba(236,72,153,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vibrant-purple"
        >
          Start
        </motion.button>
      </div>
    </header>
  );
};
