import { FC, ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  onNavigate?: (sectionId: string) => void;
}

export const Layout: FC<LayoutProps> = ({ children, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fff8f0] via-[#f7fbff] to-[#fff6f8]">
      <Header onNavigate={onNavigate} />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};
