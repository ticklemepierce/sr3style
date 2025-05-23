import {
  CornerPiece,
  EdgePiece,
  LetterScheme,
  Piece,
  SetType,
} from '~/src/types';
import { typedEnumKeys } from './utils';

const isSamePiece = (piece1: Piece, piece2: Piece) => {
  const set1 = new Set(piece1);
  const set2 = new Set(piece2);

  return set1.size === set2.size && [...set1].every((char) => set2.has(char));
};

export const getUserLetterSchemeMap = ({
  userLetterScheme,
  edgeBuffer,
  cornerBuffer,
}: {
  userLetterScheme: LetterScheme;
  edgeBuffer: Piece;
  cornerBuffer: Piece;
}) => {
  const generatePieceMapForPairs = (pieceArr: Piece[], buffer: Piece) =>
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
            .map((piece) => userLetterScheme[piece]);
        }
        return acc;
      },
      {} as Record<string, string[]>,
    );

  const generatePieceMapForParities = (pieceArr: Piece[], buffer: Piece) =>
    pieceArr.reduce(
      (acc, piece) => {
        if (!isSamePiece(piece, buffer)) {
          acc['z'].push(userLetterScheme[piece]);
        }
        return acc;
      },
      { z: [] } as Record<string, string[]>,
    );

  return {
    [SetType.EDGES]: generatePieceMapForPairs(
      typedEnumKeys(EdgePiece),
      edgeBuffer,
    ),
    [SetType.CORNERS]: generatePieceMapForPairs(
      typedEnumKeys(CornerPiece),
      cornerBuffer,
    ),
    [SetType.PARITIES]: generatePieceMapForParities(
      typedEnumKeys(CornerPiece),
      cornerBuffer,
    ),
  };
};
