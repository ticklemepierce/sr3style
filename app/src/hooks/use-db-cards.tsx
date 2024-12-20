import { useEffect, useState } from 'react';
import { CardManager, SetType, SetTypeMap, UserData } from '../types';
import { setTypeSpeffzMap } from '../utils/constants';
import { RecordLogItem } from 'ts-fsrs';

const useDbCards = ({ userData }: { userData?: UserData }): CardManager => {
  const initSetTypeMap = userData?.userSelectedLetterPairs ?? {
    edges: {},
    corners: {},
  };

  const [setTypeMap, setSetTypeMap] = useState<SetTypeMap>(initSetTypeMap);

  useEffect(() => {
    if (userData?.userSelectedLetterPairs) {
      setSetTypeMap(userData.userSelectedLetterPairs);
    }
  }, [userData]);

  const addPair = async ({
    setType,
    set,
    letter,
  }: {
    setType: SetType;
    set: string;
    letter: string;
  }) => {
    const response = await fetch(`/api/db-cards/add`, {
      method: 'POST',
      body: JSON.stringify({ letter, setType, set }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (data.success) {
      setSetTypeMap((prev) => {
        const prevSetTypeCards = prev[setType];

        return {
          ...prev,
          [setType]: {
            ...prevSetTypeCards,
            [`${set}${letter}`]: { card: JSON.parse(data.card) },
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
    const response = await fetch(`/api/db-cards/add`, {
      method: 'POST',
      body: JSON.stringify({ setType, set }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();

    if (data.success) {
      setSetTypeMap((prev) => {
        const updatedCards = { ...prev[setType] };

        setTypeSpeffzMap[setType][set].forEach((letter: string) => {
          const letterPair = `${set}${letter}`;
          updatedCards[letterPair] = { fsrsCard: data.cards[letterPair] };
        });

        return {
          ...prev,
          [setType]: updatedCards,
        };
      });
    }
  };

  const removePair = async ({
    set,
    letter,
    setType,
  }: {
    set: string;
    letter: string;
    setType: SetType;
  }) => {
    const response = await fetch(`/api/db-cards/remove`, {
      method: 'POST',
      body: JSON.stringify({ letter, setType, set }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();

    if (data.success) {
      setSetTypeMap((prev) => {
        delete prev[setType][`${set}${letter}`];

        return prev;
      });
    }
  };

  const removeSet = async ({
    setType,
    set,
  }: {
    setType: SetType;
    set: string;
  }) => {
    const response = await fetch(`/api/db-cards/remove`, {
      method: 'POST',
      body: JSON.stringify({ setType, set }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();

    if (data.success) {
      setSetTypeMap((prev) => {
        const updatedCards = { ...prev[setType] };

        setTypeSpeffzMap[setType][set].forEach((letter) => {
          delete updatedCards[`${set}${letter}`];
        });

        return {
          ...prev,
          [setType]: updatedCards,
        };
      });
    }
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
    const response = await fetch(`/api/db-cards/update`, {
      method: 'POST',
      body: JSON.stringify({ setType, letterPair, card }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();

    if (data.success) {
      setSetTypeMap((prev) => {
        const prevSetTypeCards = prev[setType];

        return {
          ...prev,
          [setType]: {
            ...prevSetTypeCards,
            [letterPair]: card.card,
          },
        };
      });
    }
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

export default useDbCards;
