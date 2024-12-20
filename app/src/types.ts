import { Card as FsrsCard, ReviewLog, Rating, RecordLogItem } from 'ts-fsrs';
import { EDGES, CORNERS } from './utils/constants';
// import { User } from '@prisma/client';
import { User } from '../entities/user.entity';

export type Card = {
  fsrsCard: FsrsCard;
  log?: ReviewLog;
};

export type Cards = {
  [pair: string]: Card;
};

export type Question = {
  pair: string;
  card: Card;
};

export interface Results {
  [pair: string]: {
    time: number;
    rating: Rating;
  };
}

export type SetType = typeof EDGES | typeof CORNERS;

export type UserData = {
  user: User;
  isPremium: boolean;
};

export type Nullable<T> = T | null;

export type SetTypeMap = Record<SetType, Cards>;

export type CardManager = {
  setTypeMap: SetTypeMap;
  removePair: ({
    set,
    letter,
    setType,
  }: {
    set: string;
    letter: string;
    setType: SetType;
  }) => Promise<void>;
  removeSet: ({
    setType,
    set,
  }: {
    setType: SetType;
    set: string;
  }) => Promise<void>;
  updateCard: ({
    card,
    letterPair,
    setType,
  }: {
    card: RecordLogItem;
    letterPair: string;
    setType: SetType;
  }) => Promise<void>;
  addPair: ({
    setType,
    set,
    letter,
  }: {
    setType: SetType;
    set: string;
    letter: string;
  }) => Promise<void>;
  addSet: ({
    setType,
    set,
  }: {
    setType: SetType;
    set: string;
  }) => Promise<void>;
};
