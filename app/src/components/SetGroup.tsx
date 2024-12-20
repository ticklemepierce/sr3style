import { useMemo, useState } from 'react';
import { FormControlLabel, Checkbox, Box, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { SetType, Cards } from '../types';
import { setTypeSpeffzMap } from '../utils/constants';
import { useSessionContext } from '../context/session';

export const SetGroup = ({
  set,
  possiblePairs,
  setType,
}: {
  set: string;
  possiblePairs: string[];
  setType: SetType;
}) => {
  const { addSet, removeSet, addPair, removePair, setTypeMap } =
    useSessionContext();

  const cards: Cards = useMemo(() => setTypeMap[setType] ?? {}, [setTypeMap]);

  const numChecked = useMemo(
    () => Object.keys(cards).filter((pair) => pair.startsWith(set)).length,
    [cards],
  );

  const [isExpanded, setIsExpanded] = useState(false);

  const areAllChecked = () =>
    numChecked === setTypeSpeffzMap[setType][set].length;
  const areSomeChecked = () =>
    0 < numChecked && numChecked < setTypeSpeffzMap[setType][set].length;

  const handleChange = async ({
    letter,
    isChecked,
  }: {
    letter: string;
    isChecked: boolean;
  }) => {
    if (letter === set) {
      if (isChecked) {
        await addSet!({ setType, set });
      } else {
        await removeSet!({ setType, set });
      }
    } else {
      if (isChecked) {
        await addPair!({ setType, set, letter });
      } else {
        await removePair!({ setType, set, letter });
      }
    }
  };

  const children = (
    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
      {possiblePairs.map((letter) => (
        <FormControlLabel
          label={letter.toUpperCase()}
          key={letter}
          control={
            <Checkbox
              checked={Boolean(cards[`${set}${letter}`])}
              onChange={async (e) =>
                await handleChange({ letter, isChecked: e.target.checked })
              }
            />
          }
        />
      ))}
    </Box>
  );

  const toggleIsExpanded = () => {
    setIsExpanded((isExpanded) => !isExpanded);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100px',
          justifyContent: 'space-between',
        }}
      >
        <FormControlLabel
          label={set.toUpperCase()}
          control={
            <Checkbox
              checked={areAllChecked()}
              indeterminate={areSomeChecked()}
              onChange={async (e) =>
                await handleChange({ letter: set, isChecked: e.target.checked })
              }
            />
          }
        />
        <IconButton aria-label={'Example'} onClick={toggleIsExpanded}>
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      {isExpanded && children}
    </>
  );
};
