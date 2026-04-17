import { FC, ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  onNavigate?: (sectionId: string) => void;
}

export const Layout: FC<LayoutProps> = ({ children, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(180deg,var(--app-bg)_0%,var(--app-bg-accent)_100%)] text-[var(--app-text)]">
      <Header onNavigate={onNavigate} />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};
