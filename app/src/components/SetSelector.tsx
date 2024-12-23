import { setTypeSpeffzMap } from '../utils/constants';
import { SetGroup } from './SetGroup';
import { SetType } from '../types';
import { ClientOnly } from './ClientOnly';
import { Heading } from '@chakra-ui/react';

const SetSelectorClient = ({ setType }: { setType: SetType }) => {
  return (
    <>
      <Heading size={'xl'}>
        Select {setType.slice(0, -1)} pairs to learn:
      </Heading>
      {Object.entries(setTypeSpeffzMap[setType]).map(([set, possiblePairs]) => (
        <SetGroup
          set={set}
          possiblePairs={possiblePairs}
          key={set}
          setType={setType}
        />
      ))}
    </>
  );
};

export const SetSelector = ({ setType }: { setType: SetType }) => {
  return (
    <ClientOnly>
      <SetSelectorClient setType={setType} />
    </ClientOnly>
  );
};

// export const SetSelector = SetSelectorClient;
