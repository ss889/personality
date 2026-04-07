import { FC } from 'react';

interface HeaderProps {}

export const Header: FC<HeaderProps> = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-vibrant-purple to-vibrant-pink bg-clip-text text-transparent">
          Personality Quiz
        </h1>
        <nav className="flex gap-4">
          <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
        </nav>
      </div>
    </header>
  );
};
