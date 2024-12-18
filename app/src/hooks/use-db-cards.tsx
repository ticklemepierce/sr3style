import { RecordLogItem } from "ts-fsrs";
import { Cards, SetType } from "../types";
import { useSettingsContext } from "../context/settings";
import { useState } from "react";
import { setTypeMap } from "../utils/constants";

const useDbCards = ({ setType, user }: { setType: SetType; user: any }) => {
  const { debugMode } = useSettingsContext(); // TODO debug mode db

  const [cards, setCards] = useState<Cards>(user?.cards[setType]);

  const addPair = async ({ set, letter }: { set: string; letter: string }) => {
    const response = await fetch(`/api/db-cards/add`, {
      method: "POST",
      body: JSON.stringify({ letter, setType, set }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.success) {
      setCards((prev) => ({
        ...prev,
        [`${set}${letter}`]: { card: JSON.parse(data.card) },
      }));
    }
  };

  const addSet = async (set: string) => {
    const response = await fetch(`/api/db-cards/add`, {
      method: "POST",
      body: JSON.stringify({ setType, set }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    if (data.success) {
      setCards((prev) => {
        // Accumulate updates in an object
        const updatedCards = { ...prev };

        setTypeMap[setType][set].forEach((letter: string) => {
          const letterPair = `${set}${letter}`;
          updatedCards[letterPair] = { card: data.cards[letterPair] };
        });

        return updatedCards; // Return the updated cards object in a single update
      });
    }
  };

  const removePair = async ({
    set,
    letter,
  }: {
    set: string;
    letter: string;
  }) => {
    const response = await fetch(`/api/db-cards/remove`, {
      method: "POST",
      body: JSON.stringify({ letter, setType, set }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    if (data.success) {
      setCards((prevCards) => {
        delete prevCards[`${set}${letter}`];

        return prevCards;
      });
    }
  };

  const removeSet = async (set: string) => {
    const response = await fetch(`/api/db-cards/remove`, {
      method: "POST",
      body: JSON.stringify({ setType, set }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    if (data.success) {
      setCards((prevCards) => {
        const updatedCards = { ...prevCards };

        setTypeMap[setType][set].forEach((letter) => {
          delete updatedCards[`${set}${letter}`];
        });

        return updatedCards;
      });
    }
  };

  const updateCard = ({
    card,
    letterPair,
  }: {
    card: RecordLogItem;
    letterPair: string;
  }) => {};

  const getCardsReadyForReview = (shuffle = false) => {};

  // TODO add type for this
  return {
    cards,
    removePair,
    updateCard,
    getCardsReadyForReview,
    addPair,
    addSet,
    removeSet,
  };
};

export default useDbCards;
