import { useState } from 'react';
import { Settings, UserData } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useSettings = ({ userData }: { userData?: UserData }): any => {
  // TODO figure out how to read from local here
  // TODO make this a default obj somewhere and use it in the db as well
  const initSettings = userData?.settings ?? {
    autoAddInverse: false,
  };

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
