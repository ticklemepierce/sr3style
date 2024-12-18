import { FormGroup } from "@mui/material";
import { setTypeMap } from "../utils/constants";
import { SetGroup } from "./SetGroup";
import Typography from "@mui/material/Typography";
import { SetType } from "../types";
import { ClientOnlyOrPremium } from "./ClientOnlyOrPremium";

const SetSelectorClient = ({
  setType,
  user,
}: {
  setType: SetType;
  user?: any;
}) => {
  return (
    <>
      <Typography variant="h5">
        Select {setType.slice(0, -1)} pairs to learn:
      </Typography>
      <FormGroup>
        {Object.entries(setTypeMap[setType]).map(([set, possiblePairs]) => (
          <SetGroup
            set={set}
            possiblePairs={possiblePairs}
            key={set}
            setType={setType}
            user={user}
          />
        ))}
      </FormGroup>
    </>
  );
};

// TODO isPremium
export const SetSelector = ({
  setType,
  user,
}: {
  setType: SetType;
  user?: any;
}) => {
  return (
    <ClientOnlyOrPremium
      fallback={<div>Loading...</div>}
      isPremium={user?.isPremium}
    >
      <SetSelectorClient setType={setType} user={user} />
    </ClientOnlyOrPremium>
  );
};
