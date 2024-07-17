import { useEffect, useState } from "react";
import { FormControlLabel, Checkbox, Box, IconButton } from "@mui/material";
import {addSet, addPair, removeSet, removePair, getCardsFromStorage} from '~/src/utils/cards';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { SetType } from "../types";
import { useSettingsContext } from "../context/settings";


interface ICheckedMap {
  [letter: string]: boolean
}

export const SetGroup = ({set, possiblePairs, type}: {set: string, possiblePairs: string[], type: SetType}) => {
  const { settings } = useSettingsContext();
  const preInitState: {[letter: string]: boolean} = possiblePairs.reduce((prev, cur) => (
    {
      ...prev, 
      [cur]: false,
    }
  ), {});
  const [checked, setChecked] = useState<ICheckedMap>(preInitState);
  const [isExpanded, setIsExpanded] = useState<Boolean>(false);

  const areAllChecked = () => Boolean(Object.values(checked).length) && Object.values(checked).every(val => !!val);
  const areSomeChecked = () => Boolean(Object.values(checked).length) && Object.values(checked).some(val => !!val) && Object.values(checked).some(val => !val);
  
  useEffect(() => {
    const cardsFromStorage = getCardsFromStorage(type);
    const initState: {[letter: string]: boolean} = possiblePairs.reduce((prev, cur) => (
      {
        ...prev, 
        [cur]: Boolean(cardsFromStorage[set + cur])
      }
    ), {});
    setChecked(initState);
  }, []);

  const handleChange = ({ letter, isChecked }: {letter: string, isChecked: boolean}) => {
    if (letter === set) {
      const allToggled = possiblePairs.reduce((prev, cur) => (
        {
          ...prev, 
          [cur]: isChecked
        }
      ), {});
      setChecked(allToggled);
      if (isChecked) {
        addSet({set, type, addInverses: Boolean(settings.autoAddInverse)});
      } else {
        removeSet({set, type});
      }
    } else {
      setChecked(prevValue => ({ ...prevValue, [letter]: isChecked}));
      if (isChecked) {
        addPair({set, letter, type, addInverses: Boolean(settings.autoAddInverse)});
      } else {
        removePair({set, letter, type});
      }
    }
  }

  const children = (
    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
      {possiblePairs.map(letter => (
        <FormControlLabel
          label={letter.toUpperCase()}
          key={letter}
          control={<Checkbox checked={checked[letter]} onChange={(e) => handleChange({ letter, isChecked: e.target.checked })} />}
        />
      ))}
    </Box>
  );

  const toggleIsExpanded = () => {
    setIsExpanded(isExpanded => !isExpanded);
  }

  return (
    <>
      <Box sx={{display: 'flex', alignItems: 'center', width: '100px', justifyContent: 'space-between'}}>
        <FormControlLabel
          label={set.toUpperCase()}
          control={
            <Checkbox
              checked={areAllChecked()}
              indeterminate={areSomeChecked()}
              onChange={(e) => handleChange({ letter: set, isChecked: e.target.checked })}
            />
          }
        />
        <IconButton aria-label="Example" onClick={toggleIsExpanded}>
          { isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon /> }
        </IconButton>
      </Box>
      {isExpanded && children}
    </>
  );
}