import { RatingType, RecordLogItem } from 'ts-fsrs';
import { EDGES, CORNERS } from './utils/constants';

export type RecordLogItemMap = {
  [caseId: string]: RecordLogItem;
};

export type Question = {
  caseId: string;
  recordLogItem: RecordLogItem;
};

export interface Results {
  [caseId: string]: {
    time: number;
    ratingType: RatingType;
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
  learningCases: LearningCases;
  isPremium: boolean;
};

export type LearningCases = Record<SetType, RecordLogItemMap>;

export type CardManager = {
  learningCases: LearningCases;
  removeSubset: ({
    set,
    subSet,
    setType,
  }: {
    set: string;
    subSet: string;
    setType: SetType;
  }) => Promise<void>;
  removeSet: ({
    setType,
    set,
  }: {
    setType: SetType;
    set: string;
  }) => Promise<void>;
  updateCase: ({
    recordLogItem,
    caseId,
    setType,
  }: {
    recordLogItem: RecordLogItem;
    caseId: string;
    setType: SetType;
  }) => Promise<void>;
  addSubset: ({
    setType,
    set,
    subSet,
  }: {
    setType: SetType;
    set: string;
    subSet: string;
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
