import { ReactNode, createContext, useContext } from 'react';
import {
  CardManager,
  LearningCases,
  Settings,
  SettingsManager,
  UserData,
} from '../types';
import useSettings from '../hooks/use-settings';
import useCards from '../hooks/use-cards';

interface ISessionContext extends CardManager, SettingsManager {
  userData?: UserData;
}

const defaultSessionContext: ISessionContext = {
  userData: undefined,
  learningCases: {} as LearningCases,
  removeSubset: async () => {},
  removeSet: async () => {},
  updateCase: async () => {},
  addSubset: async () => {},
  addSet: async () => {},
  settings: {} as Settings,
  saveSettings: () => {},
};

const SessionContext = createContext<ISessionContext>(defaultSessionContext);

export default function SessionContextProvider({
  userData,
  children,
}: {
  userData?: UserData;
  children: ReactNode;
}) {
  const cardManager = useCards({ userData });
  const settingsManager = useSettings({ userData });

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
