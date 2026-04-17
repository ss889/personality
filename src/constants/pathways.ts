export interface LinkItem {
  label: string;
  href: string;
  description: string;
}

export interface PathwayProfile {
  headline: string;
  summary: string;
  careers: LinkItem[];
  hobbies: LinkItem[];
  resources: LinkItem[];
}

export const pathwaysByType: Record<string, PathwayProfile> = {
  VISIONARY: {
    headline: 'Build momentum with creative and leadership-oriented paths.',
    summary: 'You tend to spot opportunities early. Lean into projects where experimentation, communication, and ownership matter.',
    careers: [
      {
        label: 'Product Management',
        href: 'https://www.coursera.org/articles/what-does-a-product-manager-do',
        description: 'Translate ideas into shipped outcomes with cross-functional teams.',
      },
      {
        label: 'Brand Strategy',
        href: 'https://www.theforage.com/career-path/brand-strategist',
        description: 'Shape narratives, positioning, and growth campaigns.',
      },
      {
        label: 'Startup Operations',
        href: 'https://www.ycombinator.com/library/6f-what-is-operations-at-a-startup',
        description: 'Own diverse problems and build systems from zero to one.',
      },
    ],
    hobbies: [
      {
        label: 'Design Challenges',
        href: 'https://www.dailyui.co/',
        description: 'Sharpen ideation and execution with fast-paced prompts.',
      },
      {
        label: 'Public Speaking',
        href: 'https://www.toastmasters.org/',
        description: 'Improve leadership presence and storytelling confidence.',
      },
      {
        label: 'Hackathons',
        href: 'https://devpost.com/hackathons',
        description: 'Practice rapid collaboration and problem solving.',
      },
    ],
    resources: [
      {
        label: 'Career Strengths Exploration',
        href: 'https://www.onetonline.org/explore/interests/',
        description: 'Match interests to occupations using structured profiles.',
      },
      {
        label: 'Leadership Learning Paths',
        href: 'https://www.edx.org/learn/leadership',
        description: 'Build practical leadership and strategy skills.',
      },
      {
        label: 'Goal Planning Template',
        href: 'https://www.atlassian.com/blog/productivity/smart-goals',
        description: 'Turn your profile into clear milestones and actions.',
      },
    ],
  },
  STRATEGIST: {
    headline: 'Focus on roles that reward structure, planning, and steady execution.',
    summary: 'You balance vision and practicality well. Environments with clear objectives and measurable outcomes are a strong fit.',
    careers: [
      {
        label: 'Business Analysis',
        href: 'https://www.coursera.org/articles/business-analyst',
        description: 'Use data and process thinking to improve decisions.',
      },
      {
        label: 'Project Management',
        href: 'https://www.pmi.org/about/learn-about-pmi/what-is-project-management',
        description: 'Plan delivery, coordinate teams, and reduce execution risk.',
      },
      {
        label: 'Operations Strategy',
        href: 'https://hbr.org/topic/subject/operations-strategy',
        description: 'Design systems that improve consistency and performance.',
      },
    ],
    hobbies: [
      {
        label: 'Chess and Strategy Games',
        href: 'https://www.chess.com/lessons',
        description: 'Develop pattern recognition and decision discipline.',
      },
      {
        label: 'Writing and Reflection',
        href: 'https://zenhabits.net/journal/',
        description: 'Clarify thinking and document your progress.',
      },
      {
        label: 'Personal Finance Planning',
        href: 'https://www.investopedia.com/personal-finance-4427760',
        description: 'Practice long-term planning through real-world habits.',
      },
    ],
    resources: [
      {
        label: 'Career Planning Guide',
        href: 'https://www.themuse.com/advice/career-planning-guide',
        description: 'Set direction, evaluate options, and act with confidence.',
      },
      {
        label: 'Data Skills Roadmap',
        href: 'https://roadmap.sh/data-analyst',
        description: 'Map practical steps into analysis and strategy roles.',
      },
      {
        label: 'Productivity Systems',
        href: 'https://todoist.com/productivity-methods',
        description: 'Improve planning reliability and follow-through.',
      },
    ],
  },
  EXPLORER: {
    headline: 'Choose growth paths that keep learning and variety high.',
    summary: 'You are energized by novelty and discovery. Multi-disciplinary paths with experimentation tend to unlock your best work.',
    careers: [
      {
        label: 'UX Research',
        href: 'https://www.nngroup.com/articles/what-is-ux-research/',
        description: 'Discover user insights and shape better experiences.',
      },
      {
        label: 'Community and Partnerships',
        href: 'https://www.theforage.com/career-path/community-manager',
        description: 'Build relationships and connect people to opportunities.',
      },
      {
        label: 'Content and Education',
        href: 'https://www.coursera.org/articles/instructional-designer',
        description: 'Turn complex ideas into useful, engaging learning.',
      },
    ],
    hobbies: [
      {
        label: 'Photography Walks',
        href: 'https://digital-photography-school.com/tips-for-street-photography/',
        description: 'Train observation skills and creative perspective.',
      },
      {
        label: 'Language Learning',
        href: 'https://www.duolingo.com/',
        description: 'Keep curiosity active with continuous micro-learning.',
      },
      {
        label: 'Volunteer Projects',
        href: 'https://www.volunteermatch.org/',
        description: 'Experiment with meaningful roles while helping others.',
      },
    ],
    resources: [
      {
        label: 'Career Pivot Toolkit',
        href: 'https://www.themuse.com/advice/how-to-change-careers',
        description: 'Evaluate transitions and test new directions safely.',
      },
      {
        label: 'Learning Paths Catalog',
        href: 'https://www.classcentral.com/',
        description: 'Find affordable courses across domains and goals.',
      },
      {
        label: 'Skill Portfolio Framework',
        href: 'https://roadmap.sh/',
        description: 'Combine adjacent skills into a coherent growth plan.',
      },
    ],
  },
};

export const fallbackProfile: PathwayProfile = {
  headline: 'Use your result as a starting point for deliberate exploration.',
  summary: 'Your profile is most useful when paired with real-world experiments. Try one idea from each category and track what feels energizing.',
  careers: [
    {
      label: 'Career Interest Profiler',
      href: 'https://www.mynextmove.org/explore/ip',
      description: 'Discover occupations based on interests and work style.',
    },
    {
      label: 'Job Skills Explorer',
      href: 'https://www.onetonline.org/',
      description: 'Compare roles, required skills, and growth outlook.',
    },
    {
      label: 'Career Story Exercises',
      href: 'https://www.themuse.com/advice/what-is-a-career-narrative',
      description: 'Craft a clear narrative to guide role decisions.',
    },
  ],
  hobbies: [
    {
      label: 'Creative Project Ideas',
      href: 'https://www.skillshare.com/blog/creative-hobbies-to-try/',
      description: 'Test interests through low-pressure side projects.',
    },
    {
      label: 'Habit Building Basics',
      href: 'https://jamesclear.com/habits',
      description: 'Turn interests into repeatable weekly habits.',
    },
    {
      label: 'Learning Sprint Template',
      href: 'https://www.notion.so/templates/personal-goals',
      description: 'Run 2-week experiments for hobbies and growth skills.',
    },
  ],
  resources: [
    {
      label: 'Goal Setting Guide',
      href: 'https://asana.com/resources/goal-setting-strategies',
      description: 'Convert broad ambitions into measurable action plans.',
    },
    {
      label: 'Personal Development Library',
      href: 'https://www.mindtools.com/',
      description: 'Develop practical communication and planning skills.',
    },
    {
      label: 'Accountability Framework',
      href: 'https://todoist.com/productivity-methods/pomodoro-technique',
      description: 'Keep momentum through simple, repeatable systems.',
    },
  ],
};
