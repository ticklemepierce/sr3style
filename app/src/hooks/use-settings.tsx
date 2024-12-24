import { useState } from 'react';
import { Settings, SettingsManager, UserData } from '../types';
import { DEFAULT_SETTINGS } from '../utils/constants';

const useSettings = ({
  userData,
}: {
  userData?: UserData;
}): SettingsManager => {
  // TODO figure out how to read from local here https://usehooks-ts.com/react-hook/use-read-local-storage
  // TODO make this a default obj somewhere and use it in the db as well
  const initSettings = userData?.settings ?? DEFAULT_SETTINGS;

  const [settings, setSettings] = useState<Settings>(initSettings);

  const saveSettings = (updatedSettings: Partial<Settings>) => {
    if (userData?.isPremium) {
      // TODO hit db
    } else {
      // TODO hit localStorage
    }

    setSettings((currSettings) => ({
      ...currSettings,
      ...updatedSettings,
    }));
  };

  return {
    settings,
    saveSettings,
  };
};

export default useSettings;
