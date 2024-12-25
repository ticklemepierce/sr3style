import { useMemo, useState } from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { Checkbox } from '@chakra/checkbox';
import { SetType, RecordLogItemMap } from '../types';
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
  const { addSet, removeSet, addSubset, removeSubset, learningCases } =
    useSessionContext();

  const recordLogItemMap: RecordLogItemMap = useMemo(
    () => learningCases?.[setType] ?? {},
    [learningCases],
  );

  const numChecked = Object.keys(recordLogItemMap).filter((pair) =>
    pair.startsWith(set),
  ).length;

  const indeterminate =
    0 < numChecked && numChecked < setTypeSpeffzMap[setType][set].length;

  const allChecked = numChecked === setTypeSpeffzMap[setType][set].length;

  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = async ({
    clickedLetter,
    isChecked,
  }: {
    clickedLetter: string;
    isChecked: boolean;
  }) => {
    if (clickedLetter === set) {
      if (isChecked) {
        await addSet!({ setType, set });
      } else {
        await removeSet!({ setType, set });
      }
    } else {
      if (isChecked) {
        await addSubset!({ setType, set, subSet: clickedLetter });
      } else {
        await removeSubset!({ setType, set, subSet: clickedLetter });
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
      {possiblePairs.map((subSet) => (
        <Checkbox
          key={subSet}
          checked={Boolean(recordLogItemMap[`${set}${subSet}`])}
          onCheckedChange={async (e) =>
            await handleChange({
              clickedLetter: subSet,
              isChecked: Boolean(e.checked),
            })
          }
        >
          {subSet.toUpperCase()}
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
          checked={indeterminate ? 'indeterminate' : allChecked}
          onCheckedChange={async (e) =>
            await handleChange({
              clickedLetter: set,
              isChecked: Boolean(e.checked),
            })
          }
        >
          {set.toUpperCase()}
        </Checkbox>
        <IconButton
          aria-label={'Example'}
          onClick={toggleIsExpanded}
          variant={'plain'}
        >
          {isExpanded ? <LuChevronUp /> : <LuChevronDown />}
        </IconButton>
      </Box>
      {isExpanded && children}
    </>
  );
};
