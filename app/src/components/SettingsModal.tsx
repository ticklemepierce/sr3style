import { useState } from 'react';
import { Button } from '@chakra/button';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@chakra/dialog';
import { Switch } from '@chakra/switch';
import { Settings } from '../types';
import { useSessionContext } from '../context/session';
import { DEFAULT_SETTINGS } from '../utils/constants';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsDialogProps) => {
  const { settings, saveSettings } = useSessionContext();
  const [currSettings, setCurrSettings] = useState(
    settings ?? DEFAULT_SETTINGS,
  );

  const updateCurrSettings = (updatedSetting: Partial<Settings>) => {
    setCurrSettings((currSettings) => ({
      ...currSettings,
      ...updatedSetting,
    }));
  };

  return (
    <DialogRoot placement={'center'} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Switch
            checked={currSettings.autoAddInverse}
            onCheckedChange={({ checked }) =>
              updateCurrSettings({
                autoAddInverse: checked,
              })
            }
          >
            Automatically update inverses
          </Switch>
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => saveSettings(currSettings)}>
            Save Settings
          </Button>
        </DialogFooter>
        <DialogCloseTrigger onClick={onClose} />
      </DialogContent>
    </DialogRoot>
  );
};
