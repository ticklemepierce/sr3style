import { SetType } from '../types';
import { Link } from '@remix-run/react';
import { useSessionContext } from '../context/session';
import { getCardsReadyForReview } from '../utils/cards';
import { useMemo, useState } from 'react';
import {
  Button,
  Card,
  ButtonGroup,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { SkeletonText } from '@chakra/skeleton';
import { AddItemsModal } from '~/src/components/AddItemsModal';
import { capitalizeFirstLetter } from '../utils/text';
import { LuPlus } from 'react-icons/lu';
import { Tooltip } from '@chakra/tooltip';

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
          <HStack
            justifyContent={'space-between'}
            alignItems={'center'}
            mb={'2'}
          >
            <Card.Title fontSize={'2xl'}>
              {capitalizeFirstLetter(SetType.PARITIES)}
            </Card.Title>
            <Tooltip
              content={`Add ${capitalizeFirstLetter(SetType.PARITIES)}`}
              positioning={{ placement: 'top' }}
              showArrow
            >
              <IconButton
                onClick={() => setIsAddItemsModalOpen(true)}
                aria-label={`Add ${capitalizeFirstLetter(SetType.PARITIES)}`}
                variant={'ghost'}
                rounded={'full'}
              >
                <LuPlus />
              </IconButton>
            </Tooltip>
          </HStack>
          {cardsReadyForReview ? (
            <Card.Description>
              You have {cardsReadyForReview.length} parity {caseOrCases} to
              review.
            </Card.Description>
          ) : (
            <SkeletonText noOfLines={1} height={21} />
          )}
        </Card.Body>
        <Card.Footer flexDirection={'column'}>
          <ButtonGroup justifyContent={'center'} width={'100%'}>
            <Button variant={'outline'} flex={1} asChild>
              <Link
                to={{
                  pathname: `/practice/${SetType.PARITIES}`,
                }}
              >
                Practice
              </Link>
            </Button>
            <Button
              disabled={!Boolean(cardsReadyForReview?.length)}
              asChild
              flex={1}
            >
              <Link
                to={{
                  pathname: `/quiz/${SetType.PARITIES}`,
                }}
              >
                Review Now
              </Link>
            </Button>
          </ButtonGroup>
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
