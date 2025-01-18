import { setTypeSpeffzMap } from '../utils/constants';
import { SetGroup } from './SetGroup';
import { SetType } from '../types';
import { getUserLetterSchemeMap } from '../utils/lettering-scheme';
import { useSessionContext } from '../context/session';
import { useMemo } from 'react';

export const SetSelector = ({ setType }: { setType: SetType }) => {
  const { settings } = useSessionContext();
  const letterSchemeMap = useMemo(
    () => getUserLetterSchemeMap(settings.letterScheme),
    [settings.letterScheme],
  );

  console.log({ letterSchemeMap });

  return (
    <>
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
