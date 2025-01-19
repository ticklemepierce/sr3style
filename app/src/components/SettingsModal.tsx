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
import { Color, Face, LetterScheme, Settings } from '../types';
import { useSessionContext } from '../context/session';
import { DEFAULT_SETTINGS } from '../utils/constants';
import RubiksCube from './RubiksCube';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@chakra/select';
import { createListCollection, Flex, HStack, Stack } from '@chakra-ui/react';
import { capitalizeFirstLetter } from '../utils/text';
import { typedEnumKeys } from '../utils/utils';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const colors = createListCollection({
  items: Object.values(Color).map((color) => ({
    label: capitalizeFirstLetter(color),
    value: color,
  })),
});

const ColorSelect = ({
  face,
  value,
  onChange,
}: {
  face: Face;
  value: string[];
  onChange: (val: string[], face: Face) => void;
}) => (
  <HStack>
    <label
      htmlFor={`${face}-color-select`}
      style={{ fontWeight: 'bold', width: '20px' }}
    >
      {face}:
    </label>
    <SelectRoot
      collection={colors}
      width={'150px'}
      value={value}
      onValueChange={(e) => onChange(e.value, face)}
    >
      <SelectTrigger id={`${face}-color-select`}>
        <SelectValueText placeholder={'test'} />
      </SelectTrigger>
      <SelectContent zIndex={1500}>
        {colors.items.map((color) => (
          <SelectItem item={color} key={color.value}>
            {color.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  </HStack>
);

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

  const onChange = (val: string[], face: Face) => {
    updateCurrSettings({
      orientation: {
        ...currSettings.orientation,
        [face]: val[0],
      },
    });
  };

  return (
    <DialogRoot placement={'center'} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <DialogBody paddingBottom={0}>
          <Stack gapY={'16px'}>
            <Switch
              checked={currSettings.autoAddInverse}
              onCheckedChange={({ checked }) =>
                updateCurrSettings({
                  autoAddInverse: checked,
                })
              }
              colorPalette={'blue'}
            >
              Automatically update inverses
            </Switch>
            <Switch
              checked={currSettings.autoRemoveInverse}
              onCheckedChange={({ checked }) =>
                updateCurrSettings({
                  autoRemoveInverse: checked,
                })
              }
              colorPalette={'blue'}
            >
              Automatically remove inverses
            </Switch>
          </Stack>
        </DialogBody>
        <DialogHeader>
          <DialogTitle>Lettering Scheme</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Flex wrap={'wrap'} gapY={'10px'} gapX={'25px'} marginBottom={'10px'}>
            {typedEnumKeys(Face).map((face) => (
              <ColorSelect
                face={face}
                key={face}
                value={[currSettings.orientation[face]]}
                onChange={onChange}
              />
            ))}
          </Flex>
          <RubiksCube
            orientation={currSettings.orientation}
            currLetterScheme={currSettings.letterScheme}
            onLetterSchemeChange={(newLetterScheme: LetterScheme) =>
              updateCurrSettings({ letterScheme: newLetterScheme })
            }
          />
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
