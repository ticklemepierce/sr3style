import { Cards, Question } from '../types';

const cardsObjToArray = (cardsObj: Cards): Question[] =>
  Object.entries(cardsObj).map(([pair, card]) => ({
    pair,
    card,
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
  cards?: Cards;
  shuffle?: boolean;
}) => {
  if (!cards) {
    return [];
  }

  const cardsFromStorageArray = cardsObjToArray(cards);

  const onlyDueCards = cardsFromStorageArray.filter(({ card }) => {
    const currTime = new Date();
    const cardTime = new Date(card.fsrsCard.due);

    return cardTime < currTime;
  });

  return shuffle ? shuffleQuestions(onlyDueCards) : onlyDueCards;
};
