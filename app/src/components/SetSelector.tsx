import { FormGroup } from '@mui/material';
import { setTypeSpeffzMap } from '../utils/constants';
import { SetGroup } from './SetGroup';
import Typography from '@mui/material/Typography';
import { SetType, UserData } from '../types';
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

// TODO isPremium
// TODO don't pass in user data but read off context
export const SetSelector = ({
  setType,
  userData,
}: {
  setType: SetType;
  userData?: UserData;
}) => {
  return (
    <ClientOnlyOrPremium
      fallback={<div>Loading...</div>}
      isPremium={userData?.isPremium}
    >
      <SetSelectorClient setType={setType} />
    </ClientOnlyOrPremium>
  );
};
