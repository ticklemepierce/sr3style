import { SetType } from '../types';
import useLocalStorageCards from './use-local-storage-cards';
import useDbCards from './use-db-cards';

// TODO user type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useCards = ({ setType, user }: { setType: SetType; user?: any }) => {
  const localStorageCards = useLocalStorageCards({ setType });
  const dbCards = useDbCards({ setType, user });

  console.log(user);

  // Choose the appropriate hook based on `useDb`
  const source = user?.isPremium ? dbCards : localStorageCards;

  const { cards, addPair, addSet, removeSet, removePair } = source;

  return {
    cards,
    addSet,
    addPair,
    removeSet,
    removePair,
  };
};

export default useCards;
