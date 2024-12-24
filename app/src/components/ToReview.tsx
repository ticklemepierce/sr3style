import { SetType } from '../types';
import { Link } from '@remix-run/react';
import { ClientOnly } from './ClientOnly';
import { useSessionContext } from '../context/session';
import { getCardsReadyForReview } from '../utils/cards';
import { useMemo } from 'react';
import { Button, Card } from '@chakra-ui/react';

function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const ToReviewClient = ({ setType }: { setType: SetType }) => {
  const { setTypeMap } = useSessionContext();

  const cardsReadyForReview = useMemo(
    () =>
      getCardsReadyForReview({
        cards: setTypeMap?.[setType] ?? {},
      }),
    [setTypeMap, setType],
  );

  const pairOrPairs = cardsReadyForReview.length === 1 ? 'pair' : 'pairs';

  return (
    <Card.Root width={'320px'}>
      <Card.Body gap={'2'}>
        <Card.Title mb={'2'}>{capitalizeFirstLetter(setType)}</Card.Title>
        <Card.Description>
          You have {cardsReadyForReview.length} {setType.slice(0, -1)}{' '}
          {pairOrPairs} to review.
        </Card.Description>
      </Card.Body>
      <Card.Footer justifyContent={'flex-end'}>
        <Link
          to={{
            pathname: `/quiz/${setType}`,
          }}
        >
          <Button disabled={!cardsReadyForReview.length}>Review Now</Button>
        </Link>
      </Card.Footer>
    </Card.Root>
  );
};

export const ToReview = ({ setType }: { setType: SetType }) => {
  return (
    <ClientOnly>
      <ToReviewClient setType={setType} />
    </ClientOnly>
  );
};
