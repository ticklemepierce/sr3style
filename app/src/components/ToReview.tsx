import { Button, Typography } from '@mui/material';
import { SetType } from '../types';
import { Link, useSearchParams } from '@remix-run/react';
import { ClientOnlyOrPremium } from './ClientOnlyOrPremium';
import { useSessionContext } from '../context/session';
import { getCardsReadyForReview } from '../utils/cards';
import { useMemo } from 'react';

const ToReviewClient = ({ setType }: { setType: SetType }) => {
  const [searchParams] = useSearchParams();

  const { setTypeMap } = useSessionContext();

  const cards = useMemo(
    () => setTypeMap?.[setType] ?? {},
    [setTypeMap, setType],
  );

  const cardsReadyForReview = useMemo(
    () =>
      getCardsReadyForReview({
        cards,
        shuffle: true,
      }),
    [cards],
  );

  const pairOrPairs = cardsReadyForReview.length === 1 ? 'pair' : 'pairs';

  return (
    <>
      <Typography variant={'h4'} component={'h1'} sx={{ mb: 2 }}>
        You have {cardsReadyForReview.length} {setType.slice(0, -1)}{' '}
        {pairOrPairs} to review.
      </Typography>
      {Boolean(cardsReadyForReview && cardsReadyForReview.length) && (
        <Link
          to={{
            pathname: `/quiz/${setType}`,
            search: searchParams.toString(),
          }}
        >
          <Button>Start {setType.slice(0, -1)} review</Button>
        </Link>
      )}
    </>
  );
};

export const ToReview = ({ setType }: { setType: SetType }) => {
  return (
    <ClientOnlyOrPremium>
      <ToReviewClient setType={setType} />
    </ClientOnlyOrPremium>
  );
};
