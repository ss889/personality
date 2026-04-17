import { FC } from 'react';

export const Footer: FC = () => {
  return (
    <footer className="px-4 sm:px-6 lg:px-8 pb-8 pt-4">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface)] px-6 py-8 shadow-[0_18px_50px_var(--app-shadow)] md:px-8 md:py-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--app-muted)]">Spark</p>
            <p className="mt-3 max-w-xl text-base leading-7 text-[color:var(--app-muted)]">
              A playful quiz experience shaped for smooth navigation, warm visuals, and clear results.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 md:justify-end">
            {['Home', 'Quizzes', 'Teams', 'Resources', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item === 'Home' ? 'home-hero' : item === 'Quizzes' ? 'personality-types' : item.toLowerCase()}`}
                className="rounded-full border border-[color:var(--app-border)] px-4 py-2 text-sm font-medium text-[color:var(--app-muted)] transition-colors hover:border-[color:var(--app-accent)] hover:text-[var(--app-text)]"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-[color:var(--app-border)] pt-5 text-sm text-[color:var(--app-muted)]">
          © 2026 Spark. Built with care.
        </div>
      </div>
    </footer>
  );
};
