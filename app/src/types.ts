import { Card as FsrsCard, ReviewLog, Rating } from 'ts-fsrs';
import { EDGES, CORNERS } from './utils/constants';

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

export interface Country {
  id: string;
  name: string;
  continentId: string;
  iso2: string;
}

export interface Avatar {
  id: number;
  status: string;
  thumbnail_crop_x: number | null;
  thumbnail_crop_y: number | null;
  thumbnail_crop_w: number | null;
  thumbnail_crop_h: number | null;
  url: string;
  thumb_url: string;
  is_default: boolean;
  can_edit_thumbnail: boolean;
}

export interface WcaUser {
  id: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  name: string;
  wca_id: string;
  gender: string;
  country_iso2: string;
  url: string;
  country: Country;
  delegate_status: string;
  email: string;
  location: string;
  region_id: number;
  class: string;
  teams: unknown[];
  avatar: Avatar;
}

export type Settings = {
  autoAddInverse: boolean;
};

export type UserData = {
  user: WcaUser;
  settings: Settings;
  learningSets: SetTypeMap;
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
    card: Card;
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

export type SettingsManager = {
  settings: Settings;
  saveSettings: (updatedSettings: Partial<Settings>) => void;
};
