import { FormGroup } from "@mui/material";
import { setTypeMap } from "../utils/constants";
import { SetGroup } from "./SetGroup";
import Typography from '@mui/material/Typography';
import { SetType } from "../types";

export const SetSelector = ({ type }: {type: SetType}) => {
  return (
    <>
      <Typography variant="h5">
        Select { type.slice(0, -1) } pairs to learn:
      </Typography>
      <FormGroup>
        {Object.entries(setTypeMap[type]).map(([set, possiblePairs]) => (
          <SetGroup set={set} possiblePairs={possiblePairs} key={set} type={type} />
        ))}
      </FormGroup>
    </>
  );
}