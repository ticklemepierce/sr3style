import { SetType } from '../../types';
import { useSessionContext } from '../../context/session';
import { CheckboxCard } from '@chakra/checkbox-card';
import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Switch } from '@chakra/switch';

export const PracticeSelector = ({
  setType,
  startQuiz,
}: {
  setType: SetType;
  startQuiz: (selectedSets: string[]) => void;
}) => {
  const { setTypeLetterSchemeMap, learningCases } = useSessionContext();

  const isParity = setType === SetType.PARITIES;

  const getLearningSets = () => {
    if (!learningCases) return [];
    const counts = Object.keys(learningCases?.[setType]).reduce(
      (acc, key) => {
        const letter = key[0];
        acc[letter] = (acc[letter] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const comparison = Object.entries(counts).reduce((acc, [letter, count]) => {
      if (count === setTypeLetterSchemeMap[setType]?.[letter]?.length) {
        acc.push(letter);
      }
      return acc;
    }, [] as string[]);

    return comparison;
  };

  const initSelectedStates = isParity
    ? Object.keys(learningCases?.[setType] ?? {})
    : getLearningSets();

  const [selectedSets, setSelectedSets] =
    useState<string[]>(initSelectedStates);

  const toggleSet = (set: string) => {
    setSelectedSets((prev) => {
      return prev.includes(set)
        ? prev.filter((s) => s !== set)
        : [...prev, set];
    });
  };

  const sets =
    setType === SetType.PARITIES
      ? setTypeLetterSchemeMap.parities.z
      : Object.keys(setTypeLetterSchemeMap[setType]);

  const allSelected = selectedSets.length === sets.length;

  const handleSelectAllToggle = () => {
    setSelectedSets(allSelected ? [] : [...sets]);
  };

  return (
    <Stack gapY={10} mb={10}>
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        justify={'space-between'}
        align={{ base: 'flex-start', sm: 'center' }}
        width={'100%'}
        maxW={'75vw'}
        mx={'auto'}
        gap={{ base: 4, sm: 0 }}
      >
        <Heading
          size={'4xl'}
          textAlign={{ base: 'center', sm: 'left' }}
          width={'100%'}
        >
          Select sets to practice
        </Heading>

        <Flex
          align={'center'}
          justify={{ base: 'center', sm: 'flex-end' }}
          gap={2}
          width={'100%'}
        >
          <span style={{ fontWeight: 500 }}>
            {allSelected ? 'Deselect All' : 'Select All'}
          </span>
          <Switch
            checked={allSelected}
            onChange={handleSelectAllToggle}
            colorScheme={'teal'}
          />
        </Flex>
      </Flex>
      <SimpleGrid columns={[2, 3, 4, 5]} gap={'20px'} width={'75vw'}>
        {sets.map((set) => (
          <CheckboxCard
            key={set}
            label={set.toUpperCase()}
            checked={selectedSets.includes(set)}
            inputProps={{
              onChange: () => toggleSet(set),
            }}
            cursor={'pointer'}
          />
        ))}
      </SimpleGrid>
      <Flex justify={'center'}>
        <ButtonGroup flexDirection={'column'}>
          <Button
            disabled={selectedSets.length === 0}
            onClick={() => startQuiz(selectedSets)}
            width={'100%'}
          >
            Practice Selected Sets
          </Button>
        </ButtonGroup>
      </Flex>
    </Stack>
  );
};
