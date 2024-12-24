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
import { useSettingsContext } from '../context/settings';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsDialogProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { settings, saveSettings } = useSettingsContext();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currSettings, setCurrSettings] = useState(settings);

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
            onCheckedChange={({ checked }) =>
              updateCurrSettings({
                autoAddInverse: checked,
              })
            }
          >
            Activate Chakra
          </Switch>
        </DialogBody>
        <DialogFooter>
          <Button>Save Settings</Button>
        </DialogFooter>
        <DialogCloseTrigger onClick={onClose} />
      </DialogContent>
    </DialogRoot>
  );
};
