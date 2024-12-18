import { Button, Typography } from "@mui/material";
import { SetType } from "../types";
import { Link, useSearchParams } from "@remix-run/react";
import useLocalStorageCards from "../hooks/use-local-storage-cards";
import { ClientOnlyOrPremium } from "./ClientOnlyOrPremium";

const ToReviewClient = ({ setType }: { setType: SetType }) => {
  const [searchParams] = useSearchParams();

  const { getCardsReadyForReview } = useLocalStorageCards({ setType });
  const cards = getCardsReadyForReview();

  const pairOrPairs = cards.length === 1 ? "pair" : "pairs";

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        You have {cards.length} {setType.slice(0, -1)} {pairOrPairs} to review.
      </Typography>
      {Boolean(cards && cards.length) && (
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
    <ClientOnlyOrPremium fallback={<div>Loading...</div>}>
      <ToReviewClient setType={setType} />
    </ClientOnlyOrPremium>
  );
};
