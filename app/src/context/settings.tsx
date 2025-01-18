import React, { useEffect, useState, useContext } from 'react';
import { DEFAULT_SETTINGS } from '../utils/constants';
import { Settings } from '../types';

interface ISettingsContext {
  settings: Settings;
  saveSettings: (settings: Settings) => void;
}

const SettingsContext = React.createContext<ISettingsContext>({
  settings: DEFAULT_SETTINGS,
  saveSettings: () => {},
});

export default SettingsContext;

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const saveSettings = (newSettings: Settings) => {
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
