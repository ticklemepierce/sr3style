import { useMemo, useState } from 'react';
import { Box, IconButton, Stack } from '@chakra-ui/react';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { Checkbox } from '@chakra/checkbox';
import { SetType, RecordLogItemMap } from '../types';
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
  const {
    addSet,
    removeSet,
    addSubset,
    removeSubset,
    learningCases,
    setTypeLetterSchemeMap,
  } = useSessionContext();

  const isParity = setType === SetType.PARITIES;

  const recordLogItemMap: RecordLogItemMap = useMemo(() => {
    return learningCases?.[setType] ?? {};
  }, [learningCases]);

  const numChecked = Object.keys(recordLogItemMap).filter((pair) =>
    pair.startsWith(set),
  ).length;

  const indeterminate =
    0 < numChecked && numChecked < setTypeLetterSchemeMap[setType][set].length;

  const allChecked = numChecked === setTypeLetterSchemeMap[setType][set].length;

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
        await addSubset!({ setType, set, subSet: clickedLetter, isParity });
      } else {
        await removeSubset!({ setType, set, subSet: clickedLetter, isParity });
      }
    }
  };

  const children = (
    <Stack width={'100px'} ml={3}>
      {possiblePairs.map((subSet) => (
        <Checkbox
          key={subSet}
          checked={Boolean(
            recordLogItemMap[isParity ? subSet : `${set}${subSet}`],
          )}
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
    </Stack>
  );

  const toggleIsExpanded = () => {
    setIsExpanded((isExpanded) => !isExpanded);
  };
  return (
    <>
      {!isParity && (
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
      )}
      {(isExpanded || isParity) && children}
    </>
  );
};
