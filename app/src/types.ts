import { Card, ReviewLog, Rating } from 'ts-fsrs';
import { EDGES, CORNERS } from './utils/constants';

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Question = any;
export type Questions = Question[];

export type CardWithOptionalLog = {
  card: Card;
  log?: ReviewLog;
};

export type Cards = {
  [pair: string]: { bestTime?: number } & CardWithOptionalLog;
};

export interface Results {
  [pair: string]: {
    time: number;
    rating: Rating;
  };
}

export type SetType = typeof EDGES | typeof CORNERS;

export type Nullable<T> = T | null;
