import { useMemo, useState } from "react";
import { FormControlLabel, Checkbox, Box, IconButton } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Cards, SetType } from "../types";
import { setTypeMap } from "../utils/constants";
import useCards from "../hooks/use-cards";


export const SetGroup = ({set, possiblePairs, setType, user}: {set: string, possiblePairs: string[], setType: SetType, user?: any}) => {  
  const { cards, addSet, addPair, removeSet, removePair } = useCards({ setType, user });

  const numChecked = useMemo(() => Object.keys(cards ?? {}).filter((pair) => pair.startsWith(set)).length, [cards]);

  const [isExpanded, setIsExpanded] = useState<Boolean>(false);

  const areAllChecked = () => numChecked === setTypeMap[setType][set].length;
  const areSomeChecked = () => 0 < numChecked && numChecked < setTypeMap[setType][set].length;

  const handleChange = async ({ letter, isChecked }: {letter: string, isChecked: boolean}) => {
    if (letter === set) {
      if (isChecked) {
        await addSet(set);
      } else {
        await removeSet(set);
      }
    } else {
      if (isChecked) {
        await addPair({set, letter});
      } else {
        await removePair({set, letter});
      }
    }
  }

  const children = (
    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
      {possiblePairs.map(letter => (
        <FormControlLabel
          label={letter.toUpperCase()}
          key={letter}
          control={<Checkbox checked={Boolean(cards[`${set}${letter}`])} onChange={async (e) => await handleChange({ letter, isChecked: e.target.checked })} />}
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
              onChange={async (e) => await handleChange({ letter: set, isChecked: e.target.checked })}
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