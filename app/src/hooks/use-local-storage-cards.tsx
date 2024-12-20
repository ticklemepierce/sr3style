import { useLocalStorage } from 'usehooks-ts';
// import { RecordLogItem, createEmptyCard } from 'ts-fsrs';
import { createEmptyCard, RecordLogItem } from 'ts-fsrs';
import { CardManager, SetType, SetTypeMap } from '../types';
import { useSettingsContext } from '../context/settings';
import { setTypeSpeffzMap } from '../utils/constants';

const useLocalStorageCards = (): CardManager => {
  const { settings } = useSettingsContext();

  const [setTypeMap, setSetTypeMap] = useLocalStorage<SetTypeMap>(
    'cards',
    {} as SetTypeMap,
  );

  const addToCardsIfNotExists = async ({
    setType,
    letterPair,
  }: {
    setType: SetType;
    letterPair: string;
  }) => {
    const letterPairExists = !!setTypeMap[setType][letterPair];
    if (!letterPairExists) {
      const card = createEmptyCard();

      setSetTypeMap((prev) => {
        const prevSetTypeCards = prev[setType];

        return {
          ...prev,
          [setType]: {
            ...prevSetTypeCards,
            [letterPair]: { card },
          },
        };
      });
    }
  };

  const addSet = async ({
    setType,
    set,
  }: {
    setType: SetType;
    set: string;
  }) => {
    await Promise.all(
      setTypeSpeffzMap[setType][set].map((letter) =>
        addPair({ setType, set, letter }),
      ),
    );
  };

  const addPair = async ({
    setType,
    set,
    letter,
  }: {
    setType: SetType;
    set: string;
    letter: string;
  }) => {
    await addToCardsIfNotExists({ setType, letterPair: `${set}${letter}` });
    if (settings.autoAddInverse) {
      await addToCardsIfNotExists({ setType, letterPair: `${letter}${set}` });
    }
  };

  const removeSet = async ({
    setType,
    set,
  }: {
    setType: SetType;
    set: string;
  }) => {
    await Promise.all(
      setTypeSpeffzMap[setType][set].map((letter) =>
        removePair({ setType, set, letter }),
      ),
    );
  };

  const removePair = async ({
    setType,
    set,
    letter,
  }: {
    setType: SetType;
    set: string;
    letter: string;
  }) => {
    setSetTypeMap((prev) => {
      delete prev[setType][`${set}${letter}`];

      return prev;
    });
  };

  const updateCard = async ({
    card,
    letterPair,
    setType,
  }: {
    card: RecordLogItem;
    letterPair: string;
    setType: SetType;
  }) => {
    setSetTypeMap((prev) => {
      const prevSetTypeCards = prev[setType];

      return {
        ...prev,
        [setType]: {
          ...prevSetTypeCards,
          [letterPair]: card,
        },
      };
    });
  };

  return {
    setTypeMap,
    removePair,
    removeSet,
    updateCard,
    addPair,
    addSet,
  };
};

export default useLocalStorageCards;
