import { FC } from 'react';

interface FooterProps {}

export const Footer: FC<FooterProps> = () => {
  return (
    <footer className="px-4 sm:px-6 lg:px-8 pb-8 pt-4">
      <div className="max-w-7xl mx-auto rounded-[2rem] border border-black/5 bg-white/90 px-6 py-8 shadow-[0_18px_50px_rgba(16,53,61,0.08)] md:px-8 md:py-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Spark</p>
            <p className="mt-3 max-w-xl text-base leading-7 text-gray-700">
              A playful quiz experience shaped for smooth navigation, warm visuals, and clear results.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 md:justify-end">
              {['Home', 'Quizzes', 'Teams', 'Resources'].map((item) => (
              <a
                key={item}
                  href={`#${item === 'Home' ? 'home-hero' : item === 'Quizzes' ? 'personality-types' : item.toLowerCase()}`}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-vibrant-purple hover:text-vibrant-purple"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-5 text-sm text-gray-500">
          © 2026 Spark. Built with care.
        </div>
      </div>
    </footer>
  );
};
