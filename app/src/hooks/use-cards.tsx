
import { useLocalStorage } from 'usehooks-ts';
import { RecordLogItem, createEmptyCard } from "ts-fsrs";
import { setTypeMap } from '../utils/constants';
import { Cards, SetType } from "../types";
import { useSettingsContext } from '../context/settings';
import { prisma } from '../services/db.server';
import useLocalStorageCards from './use-local-storage-cards';
import useDbCards from './use-db-cards';

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

// TODO user type
const useCards = ({ setType, user }: { setType: SetType; user?: any }) => {
  const { settings, debugMode } = useSettingsContext();
  const localStorageCards = useLocalStorageCards({ setType });
  const dbCards = useDbCards({ setType, user });

  console.log(user);

  // Choose the appropriate hook based on `useDb`
  const source = user?.isPremium ? dbCards : localStorageCards;

  const { cards, addPair, addSet, removeSet, removePair } = source;

  // const removeSet = async (set: string) => {
  //   await Promise.all(
  //     setTypeMap[setType][set].map(letter =>
  //       removePair(`${letter}${set}`)
  //     )
  //   );  
  // };

  return {
    cards,
    addSet,
    addPair,
    removeSet,
    removePair,
  };
};


export default useCards;