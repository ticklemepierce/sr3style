import { RatingType, RecordLogItem } from 'ts-fsrs';

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

export enum SetType {
  EDGES = 'edges',
  CORNERS = 'corners',
}

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
  letterScheme: LetterScheme;
  orientation: Orientation;
};

export type UserData =
  | {
      user: WcaUser;
      isPremium: false;
      setTypeLetterSchemeMap?: SetTypeLetterSchemeMap;
    }
  | {
      user: WcaUser;
      isPremium: true;
      settings: Settings;
      learningCases: LearningCases;
    };

export type LearningCases = Record<SetType, RecordLogItemMap>;

export type AddOrRemoveSubset = ({
  setType,
  set,
  subSet,
}: {
  setType: SetType;
  set: string;
  subSet: string;
}) => Promise<Response | void>;

export type AddOrRemoveSet = ({
  setType,
  set,
}: {
  setType: SetType;
  set: string;
}) => Promise<Response | void>;

export type UpdateCase = ({
  recordLogItem,
  caseId,
  setType,
}: {
  recordLogItem: RecordLogItem;
  caseId: string;
  setType: SetType;
}) => Promise<void>;

export type CardManager = {
  learningCases?: LearningCases;
  removeSubset: AddOrRemoveSubset;
  removeSet: AddOrRemoveSet;
  updateCase: UpdateCase;
  addSubset: AddOrRemoveSubset;
  addSet: AddOrRemoveSet;
};

export type SettingsManager = {
  settings: Settings;
  saveSettings: (updatedSettings: Settings) => void;
};

export type PostLearningCasesPayload = {
  learningCasesToAdd: LearningCases;
  setType: SetType;
};

export type DeleteLearningCasesPayload = {
  learningCasesToRemove: string[]; // array of caseIds
  setType: SetType;
};

export type PatchLearningCasesPayload = {
  recordLogItem: RecordLogItem;
  caseId: string;
  setType: SetType;
};

export enum EdgePiece {
  UB = 'UB',
  UR = 'UR',
  UF = 'UF',
  UL = 'UL',
  LU = 'LU',
  LF = 'LF',
  LD = 'LD',
  LB = 'LB',
  FU = 'FU',
  FR = 'FR',
  FD = 'FD',
  FL = 'FL',
  RU = 'RU',
  RB = 'RB',
  RD = 'RD',
  RF = 'RF',
  BU = 'BU',
  BL = 'BL',
  BD = 'BD',
  BR = 'BR',
  DF = 'DF',
  DR = 'DR',
  DB = 'DB',
  DL = 'DL',
}

export enum CornerPiece {
  UBL = 'UBL',
  UBR = 'UBR',
  UFR = 'UFR',
  UFL = 'UFL',
  LUB = 'LUB',
  LUF = 'LUF',
  LDF = 'LDF',
  LDB = 'LDB',
  FUL = 'FUL',
  FUR = 'FUR',
  FDR = 'FDR',
  FDL = 'FDL',
  RUF = 'RUF',
  RUB = 'RUB',
  RDB = 'RDB',
  RDF = 'RDF',
  BUR = 'BUR',
  BUL = 'BUL',
  BDL = 'BDL',
  BDR = 'BDR',
  DFL = 'DFL',
  DFR = 'DFR',
  DBR = 'DBR',
  DBL = 'DBL',
}

export type Piece = EdgePiece | CornerPiece;

export type LetterScheme = {
  [key in Piece]: string;
};

export interface PieceMap {
  [key: string]: string[];
}

export type SetTypeLetterSchemeMap = {
  [key in SetType]: PieceMap;
};

export enum Color {
  White = 'white',
  Orange = 'orange',
  Green = 'green',
  Red = 'red',
  Blue = 'blue',
  Yellow = 'yellow',
  Black = 'black',
}

export enum Face {
  U = 'U',
  D = 'D',
  F = 'F',
  B = 'B',
  L = 'L',
  R = 'R',
}

export type CubeState = {
  [key in Face]: string[];
};

export type Orientation = {
  [key in Face]: Color;
};
