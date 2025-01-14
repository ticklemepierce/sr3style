import { setTypeSpeffzMap } from '../utils/constants';
import { SetGroup } from './SetGroup';
import { SetType } from '../types';

export const SetSelector = ({ setType }: { setType: SetType }) => {
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
