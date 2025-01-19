import { Color, LearningCases, LetterScheme, Orientation } from '../types.ts';

export const SPEFFZ_LETTER_SCHEME: LetterScheme = {
  UB: 'a',
  UR: 'b',
  UF: 'c',
  UL: 'd',
  LU: 'e',
  LF: 'f',
  LD: 'g',
  LB: 'h',
  FU: 'i',
  FR: 'j',
  FD: 'k',
  FL: 'l',
  RU: 'm',
  RB: 'n',
  RD: 'o',
  RF: 'p',
  BU: 'q',
  BL: 'r',
  BD: 's',
  BR: 't',
  DF: 'u',
  DR: 'v',
  DB: 'w',
  DL: 'x',
  UBL: 'a',
  UBR: 'b',
  UFR: 'c',
  UFL: 'd',
  LUB: 'e',
  LUF: 'f',
  LDF: 'g',
  LDB: 'h',
  FUL: 'i',
  FUR: 'j',
  FDR: 'k',
  FDL: 'l',
  RUF: 'm',
  RUB: 'n',
  RDB: 'o',
  RDF: 'p',
  BUR: 'q',
  BUL: 'r',
  BDL: 's',
  BDR: 't',
  DFL: 'u',
  DFR: 'v',
  DBR: 'w',
  DBL: 'x',
};

export const DEFAULT_ORIENTATION: Orientation = {
  U: Color.White,
  L: Color.Orange,
  F: Color.Green,
  R: Color.Red,
  B: Color.Blue,
  D: Color.Yellow,
};

export const DEFAULT_TARGET_TIME_IN_MS = 15 * 1000;
export const DEFAULT_SETTINGS = {
  autoAddInverse: false,
  autoRemoveInverse: false,
  orientation: DEFAULT_ORIENTATION,
  letterScheme: SPEFFZ_LETTER_SCHEME,
};
export const DEFAULT_LEARNING_CASES = {
  edges: {},
  corners: {},
} as LearningCases;

export const WCA_ORIGIN =
  process.env.NODE_ENV === 'production'
    ? 'https://api.worldcubeassociation.org'
    : 'https://staging.worldcubeassociation.org/api/v0';
export const WCA_OAUTH_ORIGIN =
  process.env.NODE_ENV === 'production'
    ? 'https://worldcubeassociation.org'
    : 'https://staging.worldcubeassociation.org';
