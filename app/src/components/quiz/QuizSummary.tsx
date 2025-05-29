import { Results } from '~/src/types';
import { formatTime } from '~/src/utils/time';
import { Heading, Table, Stack, HStack } from '@chakra-ui/react';
import { Link, useSearchParams } from '@remix-run/react';
import { CloseButton } from '@chakra/close-button';
import { Button } from '@chakra/button';

export const QuizSummary = ({
  results,
  onPracticeAgain,
}: {
  results: Results;
  onPracticeAgain?: () => void;
}) => {
  const [searchParams] = useSearchParams();

  return (
    <Stack width={'100%'} align={'center'} gap={0}>
      <HStack width={'100%'} flexShrink={0} position={'sticky'}>
        <Link
          to={{
            pathname: `/`,
            search: searchParams.toString(),
          }}
        >
          <CloseButton />
        </Link>
      </HStack>
      <Stack maxWidth={350} width={'100%'} align={'center'}>
        <Heading size={'4xl'} my={2}>
          Results Summary
        </Heading>
        <Table.ScrollArea
          borderWidth={'1px'}
          rounded={'md'}
          maxHeight={onPracticeAgain ? '70vh' : '85vh'}
          width={'100%'}
        >
          <Table.Root stickyHeader>
            <Table.Header>
              <Table.Row bg={'bg.muted'}>
                <Table.ColumnHeader>Question</Table.ColumnHeader>
                <Table.ColumnHeader>Time</Table.ColumnHeader>
                <Table.ColumnHeader>Rating</Table.ColumnHeader>
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
        </Table.ScrollArea>
      </Stack>
      {onPracticeAgain && (
        <Button onClick={onPracticeAgain} width={'auto'} my={10}>
          Practice Again
        </Button>
      )}
    </Stack>
  );
};
