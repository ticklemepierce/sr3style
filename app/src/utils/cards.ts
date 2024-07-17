import { RecordLogItem, createEmptyCard } from "ts-fsrs";
import { CORNERS, EDGES, setTypeMap } from '../utils/constants';
import { Cards, CombinedSet, SetType } from "../types";




function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const addToCardsIfNotExists = ({newLetterPair, cards}: {newLetterPair: string, cards: Cards}) => {
  const letterPairExists = !!cards[newLetterPair];
  if (!letterPairExists) {
    const card = createEmptyCard();

    cards[newLetterPair] = { card };
  }
}

export const getCardsFromStorage = (type: SetType) => {
  const cardsFromStorage = window.localStorage.getItem(type);

  return (cardsFromStorage ? JSON.parse(cardsFromStorage) : {}) as Cards;
}

export const addSet = ({ set, type, addInverses }: {set: string, type: SetType, addInverses: boolean}) => {
  const cards = getCardsFromStorage(type);

  setTypeMap[type][set].forEach(letter => {
    addToCardsIfNotExists({ newLetterPair: `${set}${letter}`, cards });
    if (addInverses) {
      addToCardsIfNotExists({ newLetterPair: `${letter}${set}`, cards });
    }
  });

  window.localStorage.setItem(type, JSON.stringify(cards));
};

export const addPair = ({set, letter, type, addInverses}: {set: string, letter: string, type: SetType, addInverses: boolean}) => {
  const cards = getCardsFromStorage(type);

  addToCardsIfNotExists({ newLetterPair: `${set}${letter}`, cards });
  if (addInverses) {
    addToCardsIfNotExists({ newLetterPair: `${letter}${set}`, cards });
  }
  
  window.localStorage.setItem(type, JSON.stringify(cards));
};

export const removeSet = ({set, type}: {set: string, type: SetType}) => {
  const cards = getCardsFromStorage(type);

  Object.keys(cards).forEach(letterPair => {
    if (letterPair.startsWith(set)) {
      console.log("deleting "  + letterPair);
      delete cards[letterPair];
    }
  });

  window.localStorage.setItem(type, JSON.stringify(cards));
}

export const removePair = ({set, letter, type}: {set: string, letter: string, type: SetType}) => {
  const cards = getCardsFromStorage(type);

  delete cards[set + letter];

  window.localStorage.setItem(type, JSON.stringify(cards));
}

export const updateCard = ({card, pair, type} : { card: RecordLogItem, pair: string, type: SetType }) => {
  const cardsFromStorage = window.localStorage.getItem(type);

  const cards: Cards = cardsFromStorage ? JSON.parse(cardsFromStorage) : [];

  cards[pair] = card;

  window.localStorage.setItem(type, JSON.stringify(cards));
};


const cardsObjToArray = (cardsObj: Cards) => Object.entries(cardsObj).map(([pair, { card }]) => ({
  pair,
  card
}));

export const getCardsReadyForReview = ({ type, shuffle = false }: { type: SetType, shuffle: boolean }) => {
  // TODO use getCardsFromStorage
  const cardsFromStorage = window.localStorage.getItem(type);

  const cardsFromStorageArray = cardsFromStorage ? cardsObjToArray(JSON.parse(cardsFromStorage)) : [];

  const onlyDueCards = cardsFromStorageArray.filter(({ card }) => {
    const currTime = new Date();
    const cardTime = new Date(card.due);

    return cardTime < currTime;
  });

  return shuffle ? shuffleArray(onlyDueCards) : onlyDueCards;
}

export const getCardReadyForReviewForCombinedQuiz = () => {
  const combinedTypes: SetType[] = [EDGES, CORNERS];

  const combinedReviewSet = combinedTypes.reduce((prev, cur) => (
    {
      ...prev, 
      [cur]: getCardsReadyForReview({type: cur, shuffle: true})
    }
  ), {});

  return combinedReviewSet as CombinedSet;
}