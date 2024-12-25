import { Results } from '~/src/types';
import { formatTime } from '~/src/utils/time';
import { Heading, Table, Stack, Center } from '@chakra-ui/react';

export const QuizSummary = ({ results }: { results: Results }) => {
  return (
    <Center>
      <Stack maxWidth={350}>
        <Heading size={'4xl'} my={2}>
          Results Summary
        </Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Cell>Question</Table.Cell>
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
    </Center>
  );
};
