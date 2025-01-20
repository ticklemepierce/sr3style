import { ReactNode, createContext, useContext, useMemo } from 'react';
import {
  CardManager,
  CornerPiece,
  EdgePiece,
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
  resetSetType: async () => {},
  settings: {} as Settings,
  saveSettings: () => {},
  setTypeLetterSchemeMap: getUserLetterSchemeMap({
    userLetterScheme: SPEFFZ_LETTER_SCHEME,
    edgeBuffer: EdgePiece.UF,
    cornerBuffer: CornerPiece.UFR,
  }),
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
  const {
    autoAddInverse,
    autoRemoveInverse,
    letterScheme,
    edgeBuffer,
    cornerBuffer,
  } = settingsManager.settings;

  const setTypeLetterSchemeMap = useMemo(
    () =>
      getUserLetterSchemeMap({
        userLetterScheme: letterScheme,
        edgeBuffer,
        cornerBuffer,
      }),
    [letterScheme, edgeBuffer, cornerBuffer],
  );

  const cardManager = useCards({
    userData,
    setTypeLetterSchemeMap,
    autoAddInverse,
    autoRemoveInverse,
  });

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
