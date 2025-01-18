import {
  Color,
  LearningCases,
  LetterScheme,
  Orientation,
  SetType,
} from '../types.ts';

interface PieceMap {
  [key: string]: string[];
}

// TODO generate this
export const edgeMap: PieceMap = {
  a: [
    'b',
    'd',
    'e',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  b: [
    'a',
    'd',
    'e',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  d: [
    'a',
    'b',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  e: [
    'a',
    'b',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  f: [
    'a',
    'b',
    'd',
    'e',
    'g',
    'h',
    'j',
    'k',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  g: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'h',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
  ],
  h: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  j: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'h',
    'k',
    'l',
    'm',
    'n',
    'o',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  k: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'h',
    'j',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'v',
    'w',
    'x',
  ],
  l: [
    'a',
    'b',
    'd',
    'e',
    'g',
    'h',
    'j',
    'k',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  m: [
    'a',
    'd',
    'e',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  n: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    'm',
    'o',
    'p',
    'q',
    'r',
    's',
    'u',
    'v',
    'w',
    'x',
  ],
  o: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    'm',
    'n',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'w',
    'x',
  ],
  p: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'h',
    'k',
    'l',
    'm',
    'n',
    'o',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  q: [
    'b',
    'd',
    'e',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  r: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  s: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    't',
    'u',
    'v',
    'x',
  ],
  t: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    'm',
    'o',
    'p',
    'q',
    'r',
    's',
    'u',
    'v',
    'w',
    'x',
  ],
  u: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'h',
    'j',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'v',
    'w',
    'x',
  ],
  v: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    'm',
    'n',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'w',
    'x',
  ],
  w: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    't',
    'u',
    'v',
    'x',
  ],
  x: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'h',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
  ],
};

// TODO generate this
export const cornersMap: PieceMap = {
  a: [
    'b',
    'd',
    'f',
    'g',
    'h',
    'i',
    'k',
    'l',
    'n',
    'o',
    'p',
    'q',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  b: [
    'a',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'k',
    'l',
    'o',
    'p',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  d: [
    'a',
    'b',
    'e',
    'g',
    'h',
    'k',
    'l',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  e: [
    'b',
    'd',
    'f',
    'g',
    'h',
    'i',
    'k',
    'l',
    'n',
    'o',
    'p',
    'q',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  f: [
    'a',
    'b',
    'e',
    'g',
    'h',
    'k',
    'l',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  g: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'h',
    'i',
    'k',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'v',
    'w',
    'x',
  ],
  h: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'i',
    'k',
    'l',
    'n',
    'o',
    'p',
    'q',
    'r',
    't',
    'u',
    'v',
    'w',
  ],
  i: [
    'a',
    'b',
    'e',
    'g',
    'h',
    'k',
    'l',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  k: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'l',
    'n',
    'o',
    'q',
    'r',
    's',
    't',
    'u',
    'w',
    'x',
  ],
  l: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'h',
    'i',
    'k',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'v',
    'w',
    'x',
  ],
  n: [
    'a',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'k',
    'l',
    'o',
    'p',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  o: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'k',
    'l',
    'n',
    'p',
    'q',
    'r',
    's',
    'u',
    'v',
    'x',
  ],
  p: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'l',
    'n',
    'o',
    'q',
    'r',
    's',
    't',
    'u',
    'w',
    'x',
  ],
  q: [
    'a',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'k',
    'l',
    'o',
    'p',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  r: [
    'b',
    'd',
    'f',
    'g',
    'h',
    'i',
    'k',
    'l',
    'n',
    'o',
    'p',
    'q',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
  ],
  s: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'i',
    'k',
    'l',
    'n',
    'o',
    'p',
    'q',
    'r',
    't',
    'u',
    'v',
    'w',
  ],
  t: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'k',
    'l',
    'n',
    'p',
    'q',
    'r',
    's',
    'u',
    'v',
    'x',
  ],
  u: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'h',
    'i',
    'k',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'v',
    'w',
    'x',
  ],
  v: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'l',
    'n',
    'o',
    'q',
    'r',
    's',
    't',
    'u',
    'w',
    'x',
  ],
  w: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'k',
    'l',
    'n',
    'p',
    'q',
    'r',
    's',
    'u',
    'v',
    'x',
  ],
  x: [
    'a',
    'b',
    'd',
    'e',
    'f',
    'g',
    'i',
    'k',
    'l',
    'n',
    'o',
    'p',
    'q',
    'r',
    't',
    'u',
    'v',
    'w',
  ],
};

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
  orientation: DEFAULT_ORIENTATION,
  letterScheme: SPEFFZ_LETTER_SCHEME,
};
export const DEFAULT_LEARNING_CASES = {
  edges: {},
  corners: {},
} as LearningCases;

export const setTypeSpeffzMap = {
  [SetType.EDGES]: edgeMap,
  [SetType.CORNERS]: cornersMap,
} as const;

export const setTypes: SetType[] = [SetType.EDGES, SetType.CORNERS];

export const WCA_ORIGIN =
  process.env.NODE_ENV === 'production'
    ? 'https://api.worldcubeassociation.org'
    : 'https://staging.worldcubeassociation.org/api/v0';
export const WCA_OAUTH_ORIGIN =
  process.env.NODE_ENV === 'production'
    ? 'https://worldcubeassociation.org'
    : 'https://staging.worldcubeassociation.org';
