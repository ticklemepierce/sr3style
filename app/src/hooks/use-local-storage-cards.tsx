
import { useLocalStorage } from 'usehooks-ts';
import { RecordLogItem, createEmptyCard } from "ts-fsrs";
import { setTypeMap } from '../utils/constants';
import { Cards, SetType } from "../types";
import { useSettingsContext } from '../context/settings';

const cardsObjToArray = (cardsObj: Cards) => Object.entries(cardsObj).map(([pair, { card }]) => ({
  pair,
  card
}));

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const useLocalStorageCards = ({ type }: { type: SetType }) => {
  const { settings, debugMode } = useSettingsContext();

  const [cards, setCards] = useLocalStorage<Cards>(debugMode ? 'debug' + type : type, {});

  const addToCardsIfNotExists = (newLetterPair: string) => {
    const letterPairExists = !!cards[newLetterPair];
    if (!letterPairExists) {
      const card = createEmptyCard();

      setCards((prevCards) => ({
        ...prevCards,
        [newLetterPair]: { card }
      }));
    }
  }

  const addSet = (set: string) => {
    setTypeMap[type][set].forEach(letter => {
      addToCardsIfNotExists(`${set}${letter}`);
      if (settings.autoAddInverse) {
        addToCardsIfNotExists(`${letter}${set}`);
      }
    });
  }

  const addPair = ({ set, letter }: { set: string, letter: string}) => {
    addToCardsIfNotExists(`${set}${letter}`);
    if (settings.autoAddInverse) {
      addToCardsIfNotExists(`${letter}${set}`);
    }
  }

  const removeSet = (set: string) => {
    setCards((prevCards) => {
      Object.keys(prevCards).forEach(letterPair => {
        if (letterPair.startsWith(set)) {
          console.log("deleting "  + letterPair);
          delete prevCards[letterPair];
        }
      });

      return prevCards;
    });
  }

  const removePair = (letterPair: string) => {
    setCards((prevCards) => {
      delete prevCards[letterPair];

      return prevCards;
    });
  }

  const updateCard = ({card, letterPair} : { card: RecordLogItem, letterPair: string }) => {    
    setCards((prevCards) => {
      prevCards[letterPair] = card;

      return prevCards;
    });
  };

  const getCardsReadyForReview = (shuffle = false) => {
    const cardsFromStorageArray = cardsObjToArray(cards);

    const onlyDueCards = cardsFromStorageArray.filter(({ card }) => {
      const currTime = new Date();
      const cardTime = new Date(card.due);
  
      return cardTime < currTime;
    });
  
    return shuffle ? shuffleArray(onlyDueCards) : onlyDueCards;
  }

  return {
    cards,
    addSet,
    addPair,
    removeSet,
    removePair,
    updateCard,
    getCardsReadyForReview,
  };
}

export default useLocalStorageCards;