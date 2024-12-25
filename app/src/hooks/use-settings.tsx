import { useState } from 'react';
import { Settings, SettingsManager, UserData } from '../types';
import { DEFAULT_SETTINGS } from '../utils/constants';

const useSettings = ({
  userData,
}: {
  userData?: UserData;
}): SettingsManager => {
  // TODO figure out how to read from local here https://usehooks-ts.com/react-hook/use-read-local-storage
  const initSettings = userData?.settings ?? DEFAULT_SETTINGS;

  const [settings, setSettings] = useState<Settings>(initSettings);

  const saveSettings = async (updatedSettings: Settings) => {
    if (userData?.isPremium) {
      try {
        const response = await fetch(`/api/settings`, {
          method: 'POST',
          body: JSON.stringify({
            updatedSettings,
          }),
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setSettings(data);
      } catch (e) {
        console.error(e);
      }
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
