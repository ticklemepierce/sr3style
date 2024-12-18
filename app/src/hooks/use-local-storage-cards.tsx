import { useLocalStorage } from 'usehooks-ts';
import { RecordLogItem, createEmptyCard } from 'ts-fsrs';
import { Cards, SetType } from '../types';
import { useSettingsContext } from '../context/settings';
import { setTypeMap } from '../utils/constants';

const cardsObjToArray = (cardsObj: Cards) =>
  Object.entries(cardsObj).map(([pair, { card }]) => ({
    pair,
    card,
  }));

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const useLocalStorageCards = ({ setType }: { setType: SetType }) => {
  const { debugMode, settings } = useSettingsContext();

  const [cards, setCards] = useLocalStorage<Cards>(
    debugMode ? 'debug' + setType : setType,
    {},
  );

  const addToCardsIfNotExists = async (newLetterPair: string) => {
    const letterPairExists = !!cards[newLetterPair];
    if (!letterPairExists) {
      const card = createEmptyCard();

      setCards((prevCards) => ({
        ...prevCards,
        [newLetterPair]: { card },
      }));
    }
  };

  const addSet = async (set: string) => {
    await Promise.all(
      setTypeMap[setType][set].map((letter) => addPair({ set, letter })),
    );
  };

  const addPair = async ({ set, letter }: { set: string; letter: string }) => {
    await addToCardsIfNotExists(`${set}${letter}`);
    if (settings.autoAddInverse) {
      await addToCardsIfNotExists(`${letter}${set}`);
    }
  };

  const removeSet = async (set: string) => {
    await Promise.all(
      setTypeMap[setType][set].map((letter) => removePair({ set, letter })),
    );
  };

  const removePair = async ({
    set,
    letter,
  }: {
    set: string;
    letter: string;
  }) => {
    setCards((prevCards) => {
      delete prevCards[`${set}${letter}`];

      return prevCards;
    });
  };

  const updateCard = ({
    card,
    letterPair,
  }: {
    card: RecordLogItem;
    letterPair: string;
  }) => {
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
  };

  return {
    cards,
    removePair,
    removeSet,
    updateCard,
    getCardsReadyForReview,
    addPair,
    addSet,
  };
};

export default useLocalStorageCards;
