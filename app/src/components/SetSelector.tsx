import { SetGroup } from './SetGroup';
import { SetType } from '../types';
import { useSessionContext } from '../context/session';

export const SetSelector = ({ setType }: { setType: SetType }) => {
  const { setTypeLetterSchemeMap } = useSessionContext();

  return (
    <>
      {Object.entries(setTypeLetterSchemeMap[setType]).map(
        ([set, possiblePairs]) => (
          <SetGroup
            set={set}
            possiblePairs={possiblePairs}
            key={set}
            setType={setType}
          />
        ),
      )}
    </>
  );
};
