import { RecordLogItemMap, Question } from '../types';

const cardsObjToArray = (cardsObj: RecordLogItemMap): Question[] =>
  Object.entries(cardsObj).map(([caseId, recordLogItem]) => ({
    caseId,
    recordLogItem,
  }));

const shuffleQuestions = (array: Question[]) => {
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
  console.log({ cardsFromStorageArray });
  const onlyDueCards = cardsFromStorageArray.filter(({ recordLogItem }) => {
    const currTime = new Date();
    const cardTime = new Date(recordLogItem.card.due);

    return cardTime < currTime;
  });
  return shuffle ? shuffleQuestions(onlyDueCards) : onlyDueCards;
};
