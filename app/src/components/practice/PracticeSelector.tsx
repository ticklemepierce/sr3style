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

export const PracticeSelector = ({
  setType,
  startQuiz,
}: {
  setType: SetType;
  startQuiz: (selectedSets: string[]) => void;
}) => {
  const { setTypeLetterSchemeMap, learningCases } = useSessionContext();

  const [selectedSets, setSelectedSets] = useState<string[]>(
    Object.keys(learningCases?.[setType] ?? []),
  );

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

  return (
    <Stack>
      <Heading size={'4xl'} textAlign={'center'} mb={10}>
        Select sets to practice
      </Heading>
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
      <Flex justify={'flex-end'}>
        <ButtonGroup align={'end'} flexDirection={'column'}>
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
