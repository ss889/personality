import { Quiz } from '@/types/quiz';

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: "What's Your Personality Type?",
    description: 'Discover your personality across the Big Five dimensions',
    imageUrl: '',
    createdAt: new Date(),
    questions: [
      {
        id: 'q1',
        text: 'You energize by being around others',
        type: 'single',
        options: [
          { id: 'opt1', text: 'Strongly agree', value: 5 },
          { id: 'opt2', text: 'Agree', value: 4 },
          { id: 'opt3', text: 'Neutral', value: 3 },
          { id: 'opt4', text: 'Disagree', value: 2 },
          { id: 'opt5', text: 'Strongly disagree', value: 1 },
        ],
      },
      {
        id: 'q2',
        text: 'You prefer structure and routine',
        type: 'single',
        options: [
          { id: 'opt6', text: 'Strongly agree', value: 5 },
          { id: 'opt7', text: 'Agree', value: 4 },
          { id: 'opt8', text: 'Neutral', value: 3 },
          { id: 'opt9', text: 'Disagree', value: 2 },
          { id: 'opt10', text: 'Strongly disagree', value: 1 },
        ],
      },
      {
        id: 'q3',
        text: 'You focus on feelings rather than logic',
        type: 'single',
        options: [
          { id: 'opt11', text: 'Strongly agree', value: 5 },
          { id: 'opt12', text: 'Agree', value: 4 },
          { id: 'opt13', text: 'Neutral', value: 3 },
          { id: 'opt14', text: 'Disagree', value: 2 },
          { id: 'opt15', text: 'Strongly disagree', value: 1 },
        ],
      },
      {
        id: 'q4',
        text: 'You tend to procrastinate on tasks',
        type: 'single',
        options: [
          { id: 'opt16', text: 'Strongly agree', value: 5 },
          { id: 'opt17', text: 'Agree', value: 4 },
          { id: 'opt18', text: 'Neutral', value: 3 },
          { id: 'opt19', text: 'Disagree', value: 2 },
          { id: 'opt20', text: 'Strongly disagree', value: 1 },
        ],
      },
      {
        id: 'q5',
        text: 'You are emotionally reactive',
        type: 'single',
        options: [
          { id: 'opt21', text: 'Strongly agree', value: 5 },
          { id: 'opt22', text: 'Agree', value: 4 },
          { id: 'opt23', text: 'Neutral', value: 3 },
          { id: 'opt24', text: 'Disagree', value: 2 },
          { id: 'opt25', text: 'Strongly disagree', value: 1 },
        ],
      },
    ],
  },
  {
    id: 'quiz-2',
    title: 'Communication Style Quiz',
    description: 'Learn how you communicate with others',
    imageUrl: '',
    createdAt: new Date(),
    questions: [
      {
        id: 'q6',
        text: 'In meetings, you prefer to speak up first',
        type: 'single',
        options: [
          { id: 'opt26', text: 'Always', value: 5 },
          { id: 'opt27', text: 'Usually', value: 4 },
          { id: 'opt28', text: 'Sometimes', value: 3 },
          { id: 'opt29', text: 'Rarely', value: 2 },
          { id: 'opt30', text: 'Never', value: 1 },
        ],
      },
      {
        id: 'q7',
        text: 'You prefer written communication over talking',
        type: 'single',
        options: [
          { id: 'opt31', text: 'Strongly agree', value: 5 },
          { id: 'opt32', text: 'Agree', value: 4 },
          { id: 'opt33', text: 'Neutral', value: 3 },
          { id: 'opt34', text: 'Disagree', value: 2 },
          { id: 'opt35', text: 'Strongly disagree', value: 1 },
        ],
      },
      {
        id: 'q8',
        text: 'You use humor to build rapport',
        type: 'single',
        options: [
          { id: 'opt36', text: 'Strongly agree', value: 5 },
          { id: 'opt37', text: 'Agree', value: 4 },
          { id: 'opt38', text: 'Neutral', value: 3 },
          { id: 'opt39', text: 'Disagree', value: 2 },
          { id: 'opt40', text: 'Strongly disagree', value: 1 },
        ],
      },
    ],
  },
  {
    id: 'quiz-3',
    title: 'Work Values Assessment',
    description: 'Understand what matters most in your career',
    imageUrl: '',
    createdAt: new Date(),
    questions: [
      {
        id: 'q9',
        text: 'Job security is more important than growth',
        type: 'single',
        options: [
          { id: 'opt41', text: 'Strongly agree', value: 5 },
          { id: 'opt42', text: 'Agree', value: 4 },
          { id: 'opt43', text: 'Neutral', value: 3 },
          { id: 'opt44', text: 'Disagree', value: 2 },
          { id: 'opt45', text: 'Strongly disagree', value: 1 },
        ],
      },
      {
        id: 'q10',
        text: 'You want to make a positive impact in the world',
        type: 'single',
        options: [
          { id: 'opt46', text: 'Strongly agree', value: 5 },
          { id: 'opt47', text: 'Agree', value: 4 },
          { id: 'opt48', text: 'Neutral', value: 3 },
          { id: 'opt49', text: 'Disagree', value: 2 },
          { id: 'opt50', text: 'Strongly disagree', value: 1 },
        ],
      },
      {
        id: 'q11',
        text: 'Work-life balance is essential to you',
        type: 'single',
        options: [
          { id: 'opt51', text: 'Strongly agree', value: 5 },
          { id: 'opt52', text: 'Agree', value: 4 },
          { id: 'opt53', text: 'Neutral', value: 3 },
          { id: 'opt54', text: 'Disagree', value: 2 },
          { id: 'opt55', text: 'Strongly disagree', value: 1 },
        ],
      },
    ],
  },
];
