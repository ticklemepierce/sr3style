import { Button, Typography } from '@mui/material';
import { Cards, SetType } from '../types';
import { Link } from "@remix-run/react"


export const ToReview = ({ cards, type } : { cards: Cards[], type: SetType }) => {
  const pairOrPairs = cards.length === 1 ? 'pair' : 'pairs';

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        You have {cards.length} {type.slice(0, -1)} {pairOrPairs} to review.
      </Typography>
      { !!cards.length &&
        <Link to={`/quiz/${type}`}>      
          <Button>
            Start {type.slice(0, -1)} review
          </Button>
        </Link>
      }
    </>
  );
}