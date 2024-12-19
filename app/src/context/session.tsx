import { ReactNode, createContext, useContext } from 'react';
import { CardManager, UserData } from '../types';
import useLocalStorageCards from '../hooks/use-local-storage-cards';
import useDbCards from '../hooks/use-db-cards';

interface ISessionContext extends Partial<CardManager> {
  userData?: UserData;
}

const SessionContext = createContext<ISessionContext>({});

export default function SessionContextProvider({
  userData,
  children,
}: {
  userData?: UserData;
  children: ReactNode;
}) {
  const localStorageCards = useLocalStorageCards();
  const dbCards = useDbCards({ userData });

  const cardManager = userData?.isPremium ? dbCards : localStorageCards;

  const value = {
    userData,
    ...cardManager,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export const useSessionContext = () => useContext(SessionContext);
