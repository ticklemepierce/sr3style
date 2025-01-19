import { ReactNode, createContext, useContext } from 'react';
import {
  CardManager,
  Settings,
  SettingsManager,
  SetTypeLetterSchemeMap,
  UserData,
} from '../types';
import useSettings from '../hooks/use-settings';
import useCards from '../hooks/use-cards';
import { getUserLetterSchemeMap } from '../utils/lettering-scheme';
import { SPEFFZ_LETTER_SCHEME } from '../utils/constants';

interface ISessionContext extends CardManager, SettingsManager {
  userData?: UserData;
  setTypeLetterSchemeMap: SetTypeLetterSchemeMap;
}

const defaultSessionContext: ISessionContext = {
  userData: undefined,
  learningCases: undefined,
  removeSubset: async () => {},
  removeSet: async () => {},
  updateCase: async () => {},
  addSubset: async () => {},
  addSet: async () => {},
  settings: {} as Settings,
  saveSettings: () => {},
  setTypeLetterSchemeMap: getUserLetterSchemeMap(SPEFFZ_LETTER_SCHEME),
};

const SessionContext = createContext<ISessionContext>(defaultSessionContext);

export default function SessionContextProvider({
  userData,
  children,
}: {
  userData?: UserData;
  children: ReactNode;
}) {
  const settingsManager = useSettings({ userData });
  const setTypeLetterSchemeMap = getUserLetterSchemeMap(
    settingsManager.settings.letterScheme,
  );
  const cardManager = useCards({ userData, setTypeLetterSchemeMap });

  const value = {
    userData,
    ...cardManager,
    ...settingsManager,
    setTypeLetterSchemeMap,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export const useSessionContext = () => useContext(SessionContext);
