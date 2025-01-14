import { SetType } from '../types';
import { Link } from '@remix-run/react';
import { useSessionContext } from '../context/session';
import { getCardsReadyForReview } from '../utils/cards';
import { useMemo, useState } from 'react';
import { Button, Card } from '@chakra-ui/react';
import { SkeletonText } from '@chakra/skeleton';
import { AddItemsModal } from '~/src/components/AddItemsModal';

// TODO util function
function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export const SetTypeCard = ({ setType }: { setType: SetType }) => {
  const { learningCases } = useSessionContext();
  const [isAddItemsModalOpen, setIsAddItemsModalOpen] = useState(false);

  console.log(setType);
  console.log(learningCases?.[setType]);

  const cardsReadyForReview = useMemo(
    () =>
      learningCases?.[setType]
        ? getCardsReadyForReview({
            cards: learningCases?.[setType],
          })
        : null,
    [learningCases, setType],
  );

  const pairOrPairs = cardsReadyForReview?.length === 1 ? 'pair' : 'pairs';

  return (
    <>
      <Card.Root width={'100%'}>
        <Card.Body gap={'2'}>
          <Card.Title mb={'2'}>{capitalizeFirstLetter(setType)}</Card.Title>
          {cardsReadyForReview ? (
            <Card.Description>
              You have {cardsReadyForReview.length} {setType.slice(0, -1)}{' '}
              {pairOrPairs} to review.
            </Card.Description>
          ) : (
            <SkeletonText noOfLines={1} height={21} />
          )}
        </Card.Body>
        <Card.Footer justifyContent={'flex-end'}>
          <Button
            variant={'outline'}
            onClick={() => setIsAddItemsModalOpen(true)}
          >
            Add {capitalizeFirstLetter(setType)}
          </Button>
          <Link
            to={{
              pathname: `/quiz/${setType}`,
            }}
          >
            <Button disabled={!Boolean(cardsReadyForReview?.length)}>
              Review Now
            </Button>
          </Link>
        </Card.Footer>
      </Card.Root>
      {isAddItemsModalOpen && (
        <AddItemsModal
          setType={setType}
          onClose={() => setIsAddItemsModalOpen(false)}
        />
      )}
    </>
  );
};
