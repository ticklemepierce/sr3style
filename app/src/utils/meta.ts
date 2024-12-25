import type { MetaFunction } from '@remix-run/node';

export const sharedMeta: MetaFunction = () => [
  { title: 'SR-3Style' },
  {
    name: 'SR-3Style',
    content: 'Spaced-Repetition based trainer for learning 3-style',
  },
];
