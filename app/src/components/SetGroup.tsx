import { useMemo, useState } from "react";
import { FormControlLabel, Checkbox, Box, IconButton } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { SetType } from "../types";
import useLocalStorageCards from "../hooks/use-local-storage-cards";
import { setTypeMap } from "../utils/constants";


export const SetGroup = ({set, possiblePairs, type}: {set: string, possiblePairs: string[], type: SetType}) => {
  const { cards, addSet, addPair, removeSet, removePair } = useLocalStorageCards({ type });

  const numChecked = useMemo(() => Object.keys(cards).filter((pair) => pair.startsWith(set)).length, [cards]);

  const [isExpanded, setIsExpanded] = useState<Boolean>(false);

  const areAllChecked = () => numChecked === setTypeMap[type][set].length;
  const areSomeChecked = () => 0 < numChecked && numChecked < setTypeMap[type][set].length;

  const handleChange = ({ letter, isChecked }: {letter: string, isChecked: boolean}) => {
    if (letter === set) {
      if (isChecked) {
        addSet(set);
      } else {
        removeSet(set);
      }
    } else {
      if (isChecked) {
        addPair({set, letter});
      } else {
        removePair(`${set}${letter}`);
      }
    }
  }

  const children = (
    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
      {possiblePairs.map(letter => (
        <FormControlLabel
          label={letter.toUpperCase()}
          key={letter}
          control={<Checkbox checked={Boolean(cards[`${set}${letter}`])} onChange={(e) => handleChange({ letter, isChecked: e.target.checked })} />}
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