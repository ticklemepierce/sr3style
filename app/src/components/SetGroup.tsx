import { useMemo, useState } from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Checkbox } from '@chakra/checkbox';
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

  const cards: Cards = useMemo(() => setTypeMap?.[setType] ?? {}, [setTypeMap]);

  const numChecked = useMemo(
    () => Object.keys(cards).filter((pair) => pair.startsWith(set)).length,
    [cards],
  );

  const [isExpanded, setIsExpanded] = useState(false);

  const getCheckedValue = () => {
    if (!numChecked) {
      return;
    } else if (numChecked === setTypeSpeffzMap[setType][set].length) {
      return true;
    } else {
      return 'indeterminate';
    }
  };

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
    <Box
      display={'flex'}
      alignItems={'center'}
      width={'100px'}
      justifyContent={'space-between'}
      ml={3}
    >
      {possiblePairs.map((letter) => (
        <Checkbox
          key={letter}
          checked={Boolean(cards[`${set}${letter}`])}
          onCheckedChange={async (e) =>
            await handleChange({ letter, isChecked: Boolean(e.checked) })
          }
        >
          {letter.toUpperCase()}
        </Checkbox>
      ))}
    </Box>
  );

  const toggleIsExpanded = () => {
    setIsExpanded((isExpanded) => !isExpanded);
  };

  return (
    <>
      <Box
        display={'flex'}
        alignItems={'center'}
        width={'100px'}
        justifyContent={'space-between'}
      >
        <Checkbox
          checked={getCheckedValue()}
          onCheckedChange={async (e) =>
            await handleChange({ letter: set, isChecked: Boolean(e.checked) })
          }
        >
          {set.toUpperCase()}
        </Checkbox>
        <IconButton
          aria-label={'Example'}
          onClick={toggleIsExpanded}
          variant={'plain'}
        >
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </IconButton>
      </Box>
      {isExpanded && children}
    </>
  );
};
