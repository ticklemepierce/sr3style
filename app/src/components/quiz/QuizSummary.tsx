import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Results } from '~/src/types';
import { formatTime } from '~/src/utils/time';

export const QuizSummary = ({ results }: { results: Results }) => {
  return (
    <>
      <Typography variant='h4' component='h1' sx={{ my: 2 }}>
        Results Summary
      </Typography>
      <TableContainer component={Paper}>
        <Table size='small' aria-label='a dense table'>
          <TableHead>
            <TableRow>
              <TableCell>Letter Pair</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(results).map(([pair, { time, rating }]) => (
              <TableRow
                key={pair}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope='row'>
                  {pair.toUpperCase()}
                </TableCell>
                <TableCell>{formatTime(time)}</TableCell>
                <TableCell>{rating}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
