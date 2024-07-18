import { Button, Typography } from '@mui/material';
import { SetType } from '../types';
import { Link } from "@remix-run/react"
import useLocalStorageCards from '../hooks/use-local-storage-cards';
import { ClientOnly } from './ClientOnly';

const ToReviewClient = ({ type } : { type: SetType }) => {
  const { getCardsReadyForReview } = useLocalStorageCards({ type });
  const cards = getCardsReadyForReview();

  const pairOrPairs = cards.length === 1 ? 'pair' : 'pairs';

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        You have {cards.length} {type.slice(0, -1)} {pairOrPairs} to review.
      </Typography>
      { Boolean(cards && cards.length) &&
        <Link to={`/quiz/${type}`}>      
          <Button>
            Start {type.slice(0, -1)} review
          </Button>
        </Link>
      }
    </>
  );
}

export const ToReview = ({ type } : { type: SetType }) => {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      {() => <ToReviewClient type={type} />}
    </ClientOnly>
  );
}