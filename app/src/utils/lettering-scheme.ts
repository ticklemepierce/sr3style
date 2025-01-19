import {
  CornerPiece,
  EdgePiece,
  LetterScheme,
  Piece,
  SetType,
} from '~/src/types';
import { typedEnumKeys } from './utils';

const cornerBuffer = CornerPiece.UFR;
const edgeBuffer = EdgePiece.UF;

const isSamePiece = (piece1: Piece, piece2: Piece) => {
  const set1 = new Set(piece1);
  const set2 = new Set(piece2);

  return set1.size === set2.size && [...set1].every((char) => set2.has(char));
};

export const getUserLetterSchemeMap = (userLetterScheme: LetterScheme) => {
  const generatePieceMap = (pieceArr: Piece[], buffer: Piece) =>
    pieceArr.reduce(
      (acc, firstPiece) => {
        if (!isSamePiece(firstPiece, buffer)) {
          acc[userLetterScheme[firstPiece]] = pieceArr
            .filter(
              (secondPiece) =>
                !(
                  isSamePiece(firstPiece, secondPiece) ||
                  isSamePiece(secondPiece, buffer)
                ),
            )
            .map((piece) => userLetterScheme[piece]); // Initialize each key with an empty array
        }
        return acc;
      },
      {} as Record<string, string[]>,
    );

  return {
    [SetType.EDGES]: generatePieceMap(typedEnumKeys(EdgePiece), edgeBuffer),
    [SetType.CORNERS]: generatePieceMap(
      typedEnumKeys(CornerPiece),
      cornerBuffer,
    ),
  };
};
