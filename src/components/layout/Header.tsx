import { FC } from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onNavigate?: (sectionId: string) => void;
}

export const Header: FC<HeaderProps> = ({ onNavigate }) => {
  const navItems = [
    { label: 'Home', sectionId: 'home-hero' },
    { label: 'Personality Types', sectionId: 'personality-types' },
    { label: 'Teams', sectionId: 'teams' },
    { label: 'Resources', sectionId: 'resources' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100/80">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => onNavigate?.('home-hero')}
            className="text-2xl font-bold bg-gradient-to-r from-vibrant-purple to-vibrant-pink bg-clip-text text-transparent"
          >
            ∞ Spark
          </button>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigate?.(item.sectionId)}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Login Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate?.('personality-types')}
          className="px-6 py-2 bg-gradient-to-r from-vibrant-purple to-vibrant-pink text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.6),0_0_40px_rgba(236,72,153,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vibrant-purple"
        >
          Start
        </motion.button>
      </div>
    </header>
  );
};
