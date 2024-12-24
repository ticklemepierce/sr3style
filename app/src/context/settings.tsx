import React, { useEffect, useState, useContext } from 'react';
import { DEFAULT_SETTINGS } from '../utils/constants';

interface ISettings {
  autoAddInverse?: boolean;
}

interface ISettingsContext {
  settings: ISettings;
  saveSettings: (settings: ISettings) => void;
}

const SettingsContext = React.createContext<ISettingsContext>({
  settings: {},
  saveSettings: () => {},
});

export default SettingsContext;

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ISettings>({});

  const saveSettings = (newSettings: ISettings) => {
    localStorage.setItem('settings', JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  const value = {
    saveSettings,
    settings,
  };

  useEffect(() => {
    const settingsFromStorage = window.localStorage.getItem('settings');

    const settings = settingsFromStorage
      ? JSON.parse(settingsFromStorage)
      : DEFAULT_SETTINGS;

    setSettings(settings);
  }, []);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettingsContext = () =>
  useContext<ISettingsContext>(SettingsContext);
