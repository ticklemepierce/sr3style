import React, {useEffect, useState, useContext} from "react";

interface ISettings {
  autoAddInverse?: boolean,
}

interface ISettingsContext {
  settings: ISettings,
  saveSettings: Function,
  debugMode: boolean,
}

const DEFAULT_SETTINGS = {
  autoAddInverse: false,
}

const SettingsContext = React.createContext<ISettingsContext>({settings: {}, saveSettings: () => {}, debugMode: false});

export default SettingsContext;

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ISettings>({});
  const [debugMode, setDebugMode] = useState(false);

  const saveSettings = (newSettings: ISettings) => {
    localStorage.setItem('settings', JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  const value = {
    saveSettings,
    settings,
    debugMode,
  }
  
  useEffect(() => {
    const settingsFromStorage = window.localStorage.getItem('settings');

    let settings = settingsFromStorage ? JSON.parse(settingsFromStorage) : DEFAULT_SETTINGS;

    const urlParams = new URLSearchParams(window.location.search);

    setDebugMode(urlParams.get('debugMode') === '1' || urlParams.get('debugMode') === 'true');

    setSettings(settings);
  }, []);

  return <SettingsContext.Provider value={value}>
      {children}
  </SettingsContext.Provider>
}

export const useSettingsContext = () => useContext<ISettingsContext>(SettingsContext);