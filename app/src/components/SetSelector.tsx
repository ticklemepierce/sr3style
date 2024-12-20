import { FormGroup } from '@mui/material';
import { setTypeSpeffzMap } from '../utils/constants';
import { SetGroup } from './SetGroup';
import Typography from '@mui/material/Typography';
import { SetType } from '../types';
import { ClientOnlyOrPremium } from './ClientOnlyOrPremium';

const SetSelectorClient = ({ setType }: { setType: SetType }) => {
  return (
    <>
      <Typography variant={'h5'}>
        Select {setType.slice(0, -1)} pairs to learn:
      </Typography>
      <FormGroup>
        {Object.entries(setTypeSpeffzMap[setType]).map(
          ([set, possiblePairs]) => (
            <SetGroup
              set={set}
              possiblePairs={possiblePairs}
              key={set}
              setType={setType}
            />
          ),
        )}
      </FormGroup>
    </>
  );
};

export const SetSelector = ({ setType }: { setType: SetType }) => {
  return (
    <ClientOnlyOrPremium>
      <SetSelectorClient setType={setType} />
    </ClientOnlyOrPremium>
  );
};
