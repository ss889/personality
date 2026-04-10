import { FC, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { QuizCard } from '@/components/quiz/QuizCard';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { Quiz } from '@/types/quiz';
import { fetchQuizzes } from '@/utils/api';

interface HomePageProps {
  onQuizSelect?: (quizId: string) => void;
  scrollToSectionId?: string | null;
  onScrollComplete?: () => void;
}

const highlightCards = [
  {
    title: 'Clear strengths profile',
    description: 'See your strongest traits quickly and understand what they mean in practice.',
    tone: 'from-vibrant-orange/15 to-vibrant-orange/5',
    badge: 'Immediate value',
  },
  {
    title: 'Easy to compare results',
    description: 'Share outcomes with friends or teams and use them to start better conversations.',
    tone: 'from-vibrant-pink/15 to-vibrant-pink/5',
    badge: 'Collaboration ready',
  },
  {
    title: 'Fast decision support',
    description: 'Turn quiz insights into practical next steps you can act on right away.',
    tone: 'from-vibrant-cyan/15 to-vibrant-cyan/5',
    badge: 'Action focused',
  },
];

const spotlightMetrics = [
  { value: '12', label: 'assessment paths', accent: 'text-vibrant-orange' },
  { value: '100%', label: 'cross-device access', accent: 'text-vibrant-cyan' },
  { value: '3 min', label: 'average completion', accent: 'text-vibrant-pink' },
];

const journeyPoints = [
  'Pick a quiz based on your goal: self-awareness, communication, or team growth.',
  'Answer focused questions and track progress in real time.',
  'Get a concise profile you can apply immediately and share when useful.',
];

export const HomePage: FC<HomePageProps> = ({
  onQuizSelect,
  scrollToSectionId,
  onScrollComplete,
}) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuizzes = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchQuizzes();
        setQuizzes(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load quizzes';
        setError(message);
        console.error('Error loading quizzes:', err);
      } finally {
        setLoading(false);
      }
    };

    void loadQuizzes();
  }, []);

  useEffect(() => {
    if (!scrollToSectionId) {
      return;
    }

    requestAnimationFrame(() => {
      const target = document.getElementById(scrollToSectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      onScrollComplete?.();
    });
  }, [scrollToSectionId, onScrollComplete]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-vibrant-purple to-vibrant-pink text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-16 md:space-y-20 pb-10">
      <motion.section
        id="home-hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-[2rem] bg-[#10353d] px-6 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12 shadow-[0_24px_80px_rgba(16,53,61,0.18)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.18),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(6,182,212,0.2),_transparent_26%)]" />
        <div className="absolute -top-10 right-4 h-40 w-40 rounded-full bg-vibrant-orange/20 blur-3xl" />
        <div className="absolute -bottom-12 left-0 h-36 w-36 rounded-full bg-vibrant-cyan/15 blur-3xl" />

        <div className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.55 }}
            className="max-w-2xl"
          >
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
              Personality insights hub
            </p>
            <h1 className="text-4xl leading-[1.06] font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
              Get actionable personality insights in minutes.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/74 md:text-lg">
              Understand your behavior patterns, communication style, and growth opportunities with clear, shareable results.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                onClick={() => {
                  if (quizzes.length > 0) {
                    onQuizSelect?.(quizzes[0].id);
                    return;
                  }

                  document.getElementById('personality-types')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="px-7 py-3"
              >
                Start a quiz
              </Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="border-white/35 bg-white/5 text-white hover:bg-white/10"
              >
                How it works
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {spotlightMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl bg-white/8 px-4 py-4 backdrop-blur-sm">
                  <div className={`text-2xl font-extrabold ${metric.accent}`}>{metric.value}</div>
                  <div className="mt-1 text-sm text-white/70">{metric.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.16, duration: 0.55 }}
            className="relative min-h-[420px] lg:min-h-[520px]"
          >
            <div className="absolute inset-8 rounded-[2.5rem] bg-[#f4a328] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
            <div className="absolute inset-14 rounded-[2.5rem] bg-[#123e47] shadow-[0_20px_50px_rgba(0,0,0,0.12)]" />
            <div className="absolute left-[14%] top-[12%] h-32 w-32 rounded-full border-[16px] border-[#f59e0b] opacity-95 lg:h-40 lg:w-40" />
            <div className="absolute right-[10%] top-[18%] h-10 w-10 rounded-full bg-white/90 shadow-lg" />
            <div className="absolute left-[10%] bottom-[18%] h-8 w-8 rounded-full bg-vibrant-orange shadow-lg" />
            <div className="absolute right-[22%] bottom-[10%] h-8 w-8 rounded-full bg-white/85 shadow-lg" />

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-[6%] top-[24%] w-[42%] rounded-[1.75rem] bg-[#f8b84e] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.16)]"
            >
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full bg-[#f4f1ea]" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[#14343a]">Quick insight</div>
                  <div className="mt-1 text-xs leading-5 text-[#14343a]/75">A compact summary of your top traits and strongest signals.</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute right-[8%] top-[22%] w-[38%] rounded-[1.75rem] bg-[#60a55d] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.16)]"
            >
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full bg-white/85" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">Shared experience</div>
                  <div className="mt-1 text-xs leading-5 text-white/80">Results your team can discuss to improve collaboration.</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-[11%] left-[22%] w-[54%] rounded-[2rem] bg-[#f6ece1] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[#14343a]">Progress story</div>
                  <div className="text-xs text-[#14343a]/70">Step-by-step flow from first question to final recommendations.</div>
                </div>
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-vibrant-orange" />
                  <span className="h-3 w-3 rounded-full bg-vibrant-cyan" />
                  <span className="h-3 w-3 rounded-full bg-vibrant-pink" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.45 }}
        className="rounded-[1.75rem] bg-[#5f7a57] px-5 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.1)] md:px-7 md:py-6"
      >
        <div className="flex flex-wrap gap-3">
          {['Practical insights', 'Fast completion', 'Shareable outcomes'].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/25 bg-white/8 px-4 py-2 text-sm font-medium text-white/90"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start" id="journey">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="rounded-[2rem] bg-white px-6 py-8 shadow-[0_18px_50px_rgba(16,53,61,0.08)] md:px-8 md:py-10"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Why it works</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl">
            You get useful answers without wasting time.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 md:text-lg">
            The flow is simple: choose a goal, answer focused questions, and receive an outcome you can use for decisions, communication, and growth.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {journeyPoints.map((point, index) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.35 }}
                className="rounded-2xl bg-gradient-to-br from-[#fff4e7] to-white p-5 ring-1 ring-black/5"
              >
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f4a328] text-sm font-bold text-white">
                  0{index + 1}
                </div>
                <p className="text-sm leading-6 text-gray-700">{point}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="rounded-[2rem] bg-[#fff6ea] p-6 shadow-[0_18px_50px_rgba(16,53,61,0.08)] md:p-8"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Preview</p>
          <h3 className="mt-4 text-2xl font-extrabold text-gray-900">What users get from each quiz</h3>
          <div className="mt-6 grid gap-4">
            {highlightCards.map((card) => (
              <div
                key={card.title}
                className={`rounded-[1.5rem] bg-gradient-to-br ${card.tone} p-5 ring-1 ring-black/5`}
              >
                <div className="mb-3 inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-gray-800">
                  {card.badge}
                </div>
                <h4 className="text-lg font-bold text-gray-900">{card.title}</h4>
                <p className="mt-2 text-sm leading-6 text-gray-700">{card.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="personality-types" className="scroll-mt-28 space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Quiz library</p>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 md:text-4xl">Choose a path that feels right</h2>
          </div>
          <p className="max-w-xl text-gray-600">
            Every quiz is built around a specific outcome so users leave with insights they can apply right away.
          </p>
        </div>

        {loading ? (
          <SkeletonLoader count={3} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.45 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence>
              {quizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} onClick={() => onQuizSelect?.(quiz.id)} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <motion.section
        id="teams"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45 }}
        className="rounded-[2rem] bg-white px-6 py-8 shadow-[0_18px_50px_rgba(16,53,61,0.08)] md:px-8 md:py-10"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">For teams</p>
            <h2 className="mt-3 text-3xl font-extrabold text-gray-900 md:text-4xl">
              Useful for conversations, coaching, and collaboration.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
              Use quiz results in team workshops, onboarding, and coaching sessions to improve alignment and reduce communication friction.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: 'Shared language', body: 'Make results easy to discuss in a room or on a call.' },
              { title: 'Gentle guidance', body: 'Use insights to improve communication without overcomplicating it.' },
              { title: 'Actionable next steps', body: 'End with practical takeaways people can actually use.' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.35 }}
                className="rounded-[1.5rem] border border-gray-100 bg-gradient-to-br from-[#fef5e7] to-[#fff] p-5"
              >
                <div className="mb-3 h-10 w-10 rounded-full bg-vibrant-orange/15" />
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="resources"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45 }}
        className="rounded-[2rem] bg-gradient-to-r from-[#fff0df] via-[#fef8f7] to-[#e8faf9] px-6 py-8 shadow-[0_18px_50px_rgba(16,53,61,0.08)] md:px-8 md:py-10"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Resources</p>
            <h2 className="mt-3 text-3xl font-extrabold text-gray-900 md:text-4xl">
              Keep the momentum going after the result.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
              Give users next steps, implementation tips, and references so each result turns into an action plan, not just a label.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => document.getElementById('personality-types')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
              Back to quizzes
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById('home-hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              Return to top
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};
