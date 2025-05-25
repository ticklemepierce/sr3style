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
import { Color, Face, LetterScheme, Piece, Settings, SetType } from '../types';
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
import {
  createListCollection,
  Flex,
  HStack,
  Input,
  Stack,
} from '@chakra-ui/react';
import { capitalizeFirstLetter } from '../utils/text';
import { getKeyByValue, typedEnumKeys } from '../utils/utils';
import { Field } from '@chakra/field';
import { NumberInputField, NumberInputRoot } from '@chakra/number-input';

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
  const { settings, saveSettings, resetSetType } = useSessionContext();
  const [currSettings, setCurrSettings] = useState(
    settings ?? DEFAULT_SETTINGS,
  );

  const updateCurrSettings = (updatedSetting: Partial<Settings>) => {
    setCurrSettings((currSettings) => ({
      ...currSettings,
      ...updatedSetting,
    }));
  };

  const onSaveSettings = () => {
    if (settings.edgeBuffer !== currSettings.edgeBuffer) {
      resetSetType({ setType: SetType.EDGES });
    }
    if (settings.edgeBuffer !== currSettings.edgeBuffer) {
    }
    saveSettings(currSettings);
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
      <DialogContent maxHeight={'90vh'} overflow={'auto'}>
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
            <Field label={'Target Time (in seconds)'}>
              <NumberInputRoot
                value={currSettings.targetTimeInSeconds.toString()}
                min={1}
                onValueChange={({ valueAsNumber }) =>
                  updateCurrSettings({
                    targetTimeInSeconds: valueAsNumber,
                  })
                }
              >
                <NumberInputField />
              </NumberInputRoot>
            </Field>
          </Stack>
        </DialogBody>
        <DialogHeader>
          <DialogTitle>Buffers</DialogTitle>
          Note: this will reset your learning progress!
        </DialogHeader>
        <DialogBody paddingBottom={0}>
          <HStack marginBottom={'10px'}>
            <label htmlFor={'edge-buffer'} style={{ fontWeight: 'bold' }}>
              Enter edge buffer:
            </label>
            <Input
              letterSpacing={'2px'}
              maxLength={1}
              minWidth={0}
              padding={0}
              textAlign={'center'}
              width={'50px'}
              height={'35px'}
              value={settings.letterScheme[currSettings.edgeBuffer]}
              onChange={(e) =>
                updateCurrSettings({
                  edgeBuffer: getKeyByValue(
                    settings.letterScheme,
                    e.target.value.toLocaleLowerCase() as Piece,
                  ),
                })
              }
              textTransform={'capitalize'}
              id={'edge-buffer'}
            />
          </HStack>
          <HStack>
            <label htmlFor={'corner-buffer'} style={{ fontWeight: 'bold' }}>
              Enter corner buffer:
            </label>
            <Input
              letterSpacing={'2px'}
              maxLength={1}
              minWidth={0}
              padding={0}
              textAlign={'center'}
              width={'50px'}
              height={'35px'}
              textTransform={'capitalize'}
              value={settings.letterScheme[currSettings.cornerBuffer]}
              onChange={(e) => {
                updateCurrSettings({
                  cornerBuffer: getKeyByValue(
                    settings.letterScheme,
                    e.target.value.toLocaleLowerCase() as Piece,
                  ),
                });
              }}
              id={'corner-buffer'}
            />
          </HStack>
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
          <Button onClick={onSaveSettings}>Save Settings</Button>
        </DialogFooter>
        <DialogCloseTrigger onClick={onClose} />
      </DialogContent>
    </DialogRoot>
  );
};
