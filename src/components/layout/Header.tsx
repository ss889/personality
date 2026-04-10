import { FC } from 'react';

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
            className="text-2xl font-bold text-slate-900"
          >
            Spark
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

      </div>
    </header>
  );
};
