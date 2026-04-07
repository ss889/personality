import { FC } from 'react';

interface FooterProps {}

export const Footer: FC<FooterProps> = () => {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-400">© 2026 Personality Quiz Hub. Built with care.</p>
      </div>
    </footer>
  );
};
