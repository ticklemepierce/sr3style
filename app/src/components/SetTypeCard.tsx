import { SetType } from '../types';
import { Link } from '@remix-run/react';
import { useSessionContext } from '../context/session';
import { getCardsReadyForReview } from '../utils/cards';
import { useMemo, useState } from 'react';
import { Button, Card } from '@chakra-ui/react';
import { SkeletonText } from '@chakra/skeleton';
import { AddItemsModal } from '~/src/components/AddItemsModal';
import { capitalizeFirstLetter } from '../utils/text';

export const SetTypeCard = ({ setType }: { setType: SetType }) => {
  const { learningCases } = useSessionContext();
  const [isAddItemsModalOpen, setIsAddItemsModalOpen] = useState(false);

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
      <Card.Root width={'100%'} minWidth={'298px'} maxWidth={'400px'}>
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
        <Card.Footer justifyContent={'flex-end'} gap={'10px'}>
          <Button
            variant={'outline'}
            onClick={() => setIsAddItemsModalOpen(true)}
            width={'120px'}
          >
            Add {capitalizeFirstLetter(setType)}
          </Button>
          <Link
            to={{
              pathname: `/quiz/${setType}`,
            }}
          >
            <Button
              disabled={!Boolean(cardsReadyForReview?.length)}
              width={'120px'}
            >
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
