import { useState } from 'react';
import { Settings, SettingsManager, UserData } from '../types';
import { DEFAULT_SETTINGS } from '../utils/constants';
import store from 'store2';

const useSettings = ({
  userData,
}: {
  userData?: UserData;
}): SettingsManager => {
  const userSettings = userData?.isPremium
    ? userData.settings
    : store.get('settings');
  const initSettings = userSettings ?? DEFAULT_SETTINGS;

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
        setSettings(data.settings);
      } catch (e) {
        console.error(e);
      }
    } else {
      store.set('settings', updatedSettings);
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
