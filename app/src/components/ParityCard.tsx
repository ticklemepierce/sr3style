import { SetType } from '../types';
import { Link } from '@remix-run/react';
import { useSessionContext } from '../context/session';
import { getCardsReadyForReview } from '../utils/cards';
import { useMemo, useState } from 'react';
import { Button, Card } from '@chakra-ui/react';
import { SkeletonText } from '@chakra/skeleton';
import { AddItemsModal } from '~/src/components/AddItemsModal';
import { capitalizeFirstLetter } from '../utils/text';

export const ParityCard = () => {
  const { learningCases } = useSessionContext();
  const [isAddItemsModalOpen, setIsAddItemsModalOpen] = useState(false);

  const cardsReadyForReview = useMemo(
    () =>
      learningCases?.[SetType.PARITIES]
        ? getCardsReadyForReview({
            cards: learningCases?.[SetType.PARITIES],
          })
        : null,
    [learningCases],
  );

  const caseOrCases = cardsReadyForReview?.length === 1 ? 'case' : 'cases';

  return (
    <>
      <Card.Root width={'100%'} minWidth={'298px'} maxWidth={'400px'}>
        <Card.Body gap={'2'}>
          <Card.Title mb={'2'}>
            {capitalizeFirstLetter(SetType.PARITIES)}
          </Card.Title>
          {cardsReadyForReview ? (
            <Card.Description>
              You have {cardsReadyForReview.length} parity {caseOrCases} to
              review.
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
            Add {capitalizeFirstLetter(SetType.PARITIES)}
          </Button>
          <Link
            to={{
              pathname: `/quiz/${SetType.PARITIES}`,
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
          setType={SetType.PARITIES}
          onClose={() => setIsAddItemsModalOpen(false)}
        />
      )}
    </>
  );
};
