import { FC, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
  onNavigate?: (sectionId: string) => void;
}

export const Header: FC<HeaderProps> = ({ onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme, themeOptions } = useTheme();

  const handleNavigate = (sectionId: string): void => {
    onNavigate?.(sectionId);
    setMenuOpen(false);
  };

  const navItems = [
    { label: 'Home', sectionId: 'home-hero' },
    { label: 'Personality Types', sectionId: 'personality-types' },
    { label: 'Teams', sectionId: 'teams' },
    { label: 'Resources', sectionId: 'resources' },
    { label: 'Contact', sectionId: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--app-border)] bg-[color:var(--app-surface)] backdrop-blur-md shadow-[0_10px_30px_var(--app-shadow)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleNavigate('home-hero')}
            className="text-2xl font-bold text-[var(--app-text)]"
          >
            Spark
          </button>
          <span className="hidden rounded-full border border-[color:var(--app-border)] bg-[color:var(--app-control)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-control-text)] sm:inline-flex">
            {theme}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <nav aria-label="Primary navigation" className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavigate(item.sectionId)}
                className="text-sm font-medium text-[color:var(--app-muted)] transition-colors duration-200 hover:text-[var(--app-text)]"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-2 rounded-full border border-[color:var(--app-border)] bg-[color:var(--app-control)] p-1 md:flex">
            {themeOptions.map((option) => (
              <button
                key={option.name}
                type="button"
                onClick={() => setTheme(option.name)}
                aria-label={`Switch to ${option.label} theme`}
                aria-pressed={theme === option.name}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all ${theme === option.name ? 'bg-[color:var(--app-surface-strong)] text-[var(--app-text)] shadow-sm' : 'text-[color:var(--app-control-text)] hover:bg-[color:var(--app-surface-strong)] hover:opacity-80'}`}
              >
                <span className={`mr-2 inline-flex h-2.5 w-2.5 rounded-full ${option.accent}`} />
                {option.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="rounded-lg border border-[color:var(--app-border)] px-3 py-2 text-sm font-semibold text-[var(--app-text)] md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            Menu
          </button>
        </div>

      </div>

      {menuOpen && (
        <nav aria-label="Mobile navigation" className="border-t border-[color:var(--app-border)] bg-[color:var(--app-surface)] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavigate(item.sectionId)}
                className="rounded-xl px-4 py-3 text-left text-sm font-medium text-[var(--app-text)] transition-colors hover:bg-[color:var(--app-control)]"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.name}
                type="button"
                onClick={() => setTheme(option.name)}
                aria-pressed={theme === option.name}
                className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${theme === option.name ? 'border-[color:var(--app-accent)] bg-[color:var(--app-control)] text-[var(--app-text)]' : 'border-[color:var(--app-border)] text-[color:var(--app-muted)]'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </nav>
      )}

    </header>
  );
};
