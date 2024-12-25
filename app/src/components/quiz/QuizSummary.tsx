import { Results } from '~/src/types';
import { formatTime } from '~/src/utils/time';
import { Heading, Table, Stack } from '@chakra-ui/react';

export const QuizSummary = ({ results }: { results: Results }) => {
  return (
    <Stack>
      <Heading size={'4xl'} my={2}>
        Results Summary
      </Heading>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            {/* TODO Letter Pair should be phased out */}
            <Table.Cell>Letter Pair</Table.Cell>
            <Table.Cell>Time</Table.Cell>
            <Table.Cell>Rating</Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.entries(results).map(([pair, { time, ratingType }]) => (
            <Table.Row key={pair}>
              <Table.Cell>{pair.toUpperCase()}</Table.Cell>
              <Table.Cell>{formatTime(time)}</Table.Cell>
              <Table.Cell>{ratingType}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Stack>
  );
};
