import { type LinkItem, type PathwayProfile } from '@/constants/pathways';

const ALLOWED_HOSTS = new Set([
  'asana.com',
  'atlassian.com',
  'classcentral.com',
  'coursera.org',
  'dailyui.co',
  'devpost.com',
  'digital-photography-school.com',
  'duolingo.com',
  'edx.org',
  'hbr.org',
  'investopedia.com',
  'jamesclear.com',
  'mindtools.com',
  'mynextmove.org',
  'nngroup.com',
  'notion.so',
  'onetonline.org',
  'pmi.org',
  'roadmap.sh',
  'skillshare.com',
  'theforage.com',
  'themuse.com',
  'todoist.com',
  'toastmasters.org',
  'volunteermatch.org',
  'ycombinator.com',
  'zenhabits.net',
]);

const isAllowedHost = (hostname: string): boolean => {
  const lower = hostname.toLowerCase();
  if (ALLOWED_HOSTS.has(lower)) {
    return true;
  }

  return Array.from(ALLOWED_HOSTS).some((allowed) => lower.endsWith(`.${allowed}`));
};

export const isAllowedExternalLink = (href: string): boolean => {
  try {
    const url = new URL(href);
    if (!['https:', 'http:'].includes(url.protocol)) {
      return false;
    }

    return isAllowedHost(url.hostname);
  } catch {
    return false;
  }
};

const sanitizeLinks = (items: LinkItem[]): LinkItem[] =>
  items.filter((item) => isAllowedExternalLink(item.href));

export const sanitizePathwayProfile = (profile: PathwayProfile): PathwayProfile => ({
  ...profile,
  careers: sanitizeLinks(profile.careers),
  hobbies: sanitizeLinks(profile.hobbies),
  resources: sanitizeLinks(profile.resources),
});
