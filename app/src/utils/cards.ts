import {
  RecordLogItemMap,
  Question,
  SetTypeLetterSchemeMap,
  SetType,
} from '../types';
import { createEmptyCard } from 'ts-fsrs';

const cardsObjToArray = (cardsObj: RecordLogItemMap): Question[] =>
  Object.entries(cardsObj).map(([caseId, recordLogItem]) => ({
    caseId,
    recordLogItem,
  }));

export const shuffleQuestions = (array: Question[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getCardsReadyForReview = ({
  cards,
  shuffle = false,
}: {
  cards?: RecordLogItemMap;
  shuffle?: boolean;
}) => {
  if (!cards) {
    return [];
  }

  const cardsFromStorageArray = cardsObjToArray(cards);
  const onlyDueCards = cardsFromStorageArray.filter(({ recordLogItem }) => {
    const currTime = new Date();
    const cardTime = new Date(recordLogItem.card.due);

    return cardTime < currTime;
  });
  return shuffle ? shuffleQuestions(onlyDueCards) : onlyDueCards;
};

export const shuffleCards = (cards: RecordLogItemMap) => {
  const cardsFromStorageArray = cardsObjToArray(cards);
  return shuffleQuestions(cardsFromStorageArray);
};

// TODO move this to a hook
export const createCardsForSets = ({
  sets,
  autoAddInverse,
  setTypeLetterSchemeMap,
  setType,
}: {
  sets: string[];
  autoAddInverse: boolean;
  setTypeLetterSchemeMap: SetTypeLetterSchemeMap;
  setType: SetType;
}) => {
  const isParity = setType === SetType.PARITIES;
  return sets.reduce((acc, set) => {
    if (isParity) {
      acc[set] = {
        card: createEmptyCard(),
      };
    } else {
      setTypeLetterSchemeMap[setType][set].forEach((subSet) => {
        acc[`${set}${subSet}`] = {
          card: createEmptyCard(),
        };
        if (autoAddInverse) {
          acc[`${subSet}${set}`] = {
            card: createEmptyCard(),
          };
        }
      });
    }
    return acc;
  }, {} as RecordLogItemMap);
};
