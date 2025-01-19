import { Grid, GridItem, Input } from '@chakra-ui/react';
import {
  Color,
  Face,
  Orientation,
  Piece,
  LetterScheme,
  EdgePiece,
  CornerPiece,
} from '../types';
import { DEFAULT_ORIENTATION } from '../utils/constants';
import { typedEntries } from '../utils/utils';

// Layout map for the cube
const faceLayout: Record<Face, { colStart: number; rowStart: number }> = {
  U: { colStart: 2, rowStart: 1 },
  L: { colStart: 1, rowStart: 2 },
  F: { colStart: 2, rowStart: 2 },
  R: { colStart: 3, rowStart: 2 },
  B: { colStart: 4, rowStart: 2 },
  D: { colStart: 2, rowStart: 3 },
};

const faceSchemeKeys: Record<Face, Piece[]> = {
  [Face.U]: [
    CornerPiece.UBL,
    EdgePiece.UB,
    CornerPiece.UBR,
    EdgePiece.UL,
    EdgePiece.UR,
    CornerPiece.UFL,
    EdgePiece.UF,
    CornerPiece.UFR,
  ],
  [Face.L]: [
    CornerPiece.LUB,
    EdgePiece.LU,
    CornerPiece.LUF,
    EdgePiece.LB,
    EdgePiece.LF,
    CornerPiece.LDB,
    EdgePiece.LD,
    CornerPiece.LDF,
  ],
  [Face.F]: [
    CornerPiece.FUL,
    EdgePiece.FU,
    CornerPiece.FUR,
    EdgePiece.FL,
    EdgePiece.FR,
    CornerPiece.FDL,
    EdgePiece.FD,
    CornerPiece.FDR,
  ],
  [Face.R]: [
    CornerPiece.RUF,
    EdgePiece.RU,
    CornerPiece.RUB,
    EdgePiece.RF,
    EdgePiece.RB,
    CornerPiece.RDF,
    EdgePiece.RD,
    CornerPiece.RDB,
  ],
  [Face.B]: [
    CornerPiece.BUR,
    EdgePiece.BU,
    CornerPiece.BUL,
    EdgePiece.BR,
    EdgePiece.BL,
    CornerPiece.BDR,
    EdgePiece.BD,
    CornerPiece.BDL,
  ],
  [Face.D]: [
    CornerPiece.DFL,
    EdgePiece.DF,
    CornerPiece.DFR,
    EdgePiece.DL,
    EdgePiece.DR,
    CornerPiece.DBL,
    EdgePiece.DB,
    CornerPiece.DBR,
  ],
};

const textColorMap: Record<Color, 'white' | 'black'> = {
  [Color.White]: 'black',
  [Color.Orange]: 'black',
  [Color.Green]: 'black',
  [Color.Red]: 'black',
  [Color.Yellow]: 'black',
  [Color.Blue]: 'white',
  [Color.Black]: 'white',
};

// Components
const StickerInput = ({
  value,
  textColor,
  disabled,
  onChange,
}: {
  value: string;
  textColor: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) => (
  <Input
    h={'100%'}
    w={'100%'}
    value={value}
    bg={'transparent'}
    border={'1px solid slategray'}
    borderRadius={0}
    fontSize={'20px'}
    letterSpacing={'2px'}
    textAlign={'center'}
    color={textColor}
    cursor={disabled ? 'not-allowed' : 'pointer'}
    maxLength={1}
    minWidth={0}
    padding={0}
    disabled={disabled}
    onChange={(e) => onChange(e.target.value)}
    _focus={{ boxShadow: 'none', outline: 'none' }}
  />
);

const FaceGrid = ({
  faceColor,
  textColor,
  pieces,
  onLetterChange,
  currLetterScheme,
}: {
  faceColor: Color;
  textColor: string;
  pieces: Piece[];
  onLetterChange: (piece: Piece, value: string) => void;
  currLetterScheme: LetterScheme;
}) => (
  <Grid
    bg={faceColor}
    templateColumns={'repeat(3, 30px)'}
    templateRows={'repeat(3, 30px)'}
    justifyContent={'center'}
    alignItems={'center'}
  >
    {Array.from({ length: 9 }).map((_, index) => {
      // Skip the middle cell (index 4)
      if (index === 4) {
        return (
          <GridItem
            key={index}
            h={'100%'}
            w={'100%'}
            bg={'transparent'}
            border={'1px solid slategray'}
          />
        );
      }

      // Map index to the correct position in the letters array
      const pieceIndex = index > 4 ? index - 1 : index;
      const piece = pieces[pieceIndex];
      return (
        <GridItem h={'100%'} w={'100%'} key={index}>
          <StickerInput
            value={currLetterScheme[piece]}
            textColor={textColor}
            disabled={false}
            onChange={(value) => onLetterChange(piece, value)}
          />
        </GridItem>
      );
    })}
  </Grid>
);

const RubiksCube = ({
  orientation = DEFAULT_ORIENTATION,
  currLetterScheme,
  onLetterSchemeChange,
}: {
  orientation: Orientation;
  currLetterScheme: LetterScheme;
  onLetterSchemeChange: (newLetterScheme: LetterScheme) => void;
}) => {
  const handleInputChange = (piece: Piece, value: string) => {
    onLetterSchemeChange({
      ...currLetterScheme,
      [piece]: value,
    });
  };

  return (
    <Grid
      templateColumns={'repeat(4, auto)'}
      templateRows={'repeat(3, auto)'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      {typedEntries(faceSchemeKeys).map(([face, pieces]) => {
        const { colStart, rowStart } = faceLayout[face];
        const faceColor = orientation[face];
        return (
          <GridItem key={face} colStart={colStart} rowStart={rowStart}>
            <FaceGrid
              faceColor={orientation[face]}
              textColor={textColorMap[faceColor]}
              pieces={pieces}
              onLetterChange={handleInputChange}
              currLetterScheme={currLetterScheme}
            />
          </GridItem>
        );
      })}
    </Grid>
  );
};

export default RubiksCube;
