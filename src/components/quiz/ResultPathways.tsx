import { FC } from 'react';
import { motion } from 'framer-motion';
import { PersonalityResult } from '@/types/quiz';
import { pathwaysByType, fallbackProfile, type LinkItem } from '@/constants/pathways';
import { sanitizePathwayProfile } from '@/utils/linkSafety';

interface ResultPathwaysProps {
  result: PersonalityResult;
}

const normalizeType = (value: string): string => value.trim().toUpperCase();

const renderLinkList = (title: string, items: LinkItem[]): JSX.Element => (
  <div className="space-y-3 rounded-2xl bg-[#f8fbff] p-5 ring-1 ring-black/5">
    <h4 className="text-lg font-bold text-gray-900">{title}</h4>
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${item.label} (opens in a new tab)`}
            className="group block rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-[#f4a328]"
          >
            <p className="font-semibold text-[#123e47] group-hover:text-[#0f3038]">{item.label}</p>
            <p className="mt-1 text-sm leading-6 text-gray-600">{item.description}</p>
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export const ResultPathways: FC<ResultPathwaysProps> = ({ result }) => {
  const resultType = normalizeType(result.personalityType);
  const profile = sanitizePathwayProfile(pathwaysByType[resultType] ?? fallbackProfile);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.42 }}
      className="mt-8 rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-[0_16px_40px_rgba(16,53,61,0.06)] md:p-7"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Next step pathways</p>
      <h3 className="mt-2 text-2xl font-extrabold text-gray-900">{profile.headline}</h3>
      <p className="mt-3 text-base leading-7 text-gray-600">{profile.summary}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {renderLinkList('Career ideas', profile.careers)}
        {renderLinkList('Hobby experiments', profile.hobbies)}
        {renderLinkList('Guides and tools', profile.resources)}
      </div>
    </motion.section>
  );
};
