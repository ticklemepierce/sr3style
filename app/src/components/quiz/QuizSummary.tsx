import { Results } from '~/src/types';
import { formatTime } from '~/src/utils/time';
import { Heading, Table, Stack } from '@chakra-ui/react';

export const QuizSummary = ({ results }: { results: Results }) => {
  // return 'quiz summary';
  return (
    <Stack>
      <Heading size={'4xl'} my={2}>
        Results Summary
      </Heading>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Cell>Letter Pair</Table.Cell>
            <Table.Cell>Time</Table.Cell>
            <Table.Cell>Rating</Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.entries(results).map(([pair, { time, rating }]) => (
            <Table.Row
              key={pair}
              // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <Table.Cell>{pair.toUpperCase()}</Table.Cell>
              <Table.Cell>{formatTime(time)}</Table.Cell>
              <Table.Cell>{rating}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Stack>
  );
};
