import { ReactNode, createContext, useContext } from 'react';
import { CardManager, SettingsManager, UserData } from '../types';
import useLocalStorageCards from '../hooks/use-local-storage-cards';
import useDbCards from '../hooks/use-db-cards';
import useSettings from '../hooks/use-settings';

interface ISessionContext
  extends Partial<CardManager>,
    Partial<SettingsManager> {
  userData?: UserData;
}

// TODO initialize context better here
const SessionContext = createContext<ISessionContext>({});

export default function SessionContextProvider({
  userData,
  children,
}: {
  userData?: UserData;
  children: ReactNode;
}) {
  // TODO conosolidate down to one cards hook
  const localStorageCards = useLocalStorageCards();
  const dbCards = useDbCards({ userData });

  const settingsManager = useSettings({ userData });

  const cardManager = userData?.isPremium ? dbCards : localStorageCards;

  const value = {
    userData,
    ...cardManager,
    ...settingsManager,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export const useSessionContext = () => useContext(SessionContext);
