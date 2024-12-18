import { json } from "@remix-run/node";
import { prisma } from "../src/services/db.server";
import { setTypeMap } from "~/src/utils/constants";
import { Card, createEmptyCard } from "ts-fsrs";
import { Cards, SetType } from "~/src/types";

type RequestPayload = {
  letter?: string;
  setType: SetType;
  set: string; // Optional if not always present
};

// TODO add inverse
export const action = async ({ request }: { request: Request }) => {
  const { letter, setType, set }: RequestPayload = await request.json();

  console.log(letter);
  console.log(setType);
  console.log(set);


  // TODO better validation
  if (!setType || (!set)) {
    return json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    if (letter) {
      const letterPair = `${set}${letter}`;

      // Remove a single letterPair
      // TODO remove inverse
      const card = JSON.stringify(createEmptyCard());

      await prisma.sets.upsert({
        where: {
          letterPair_setType: {
            letterPair,
            setType,
          },
        },
        update: {},
        create: {
          letterPair,
          setType,
          card,
        },
      });
  
      return json({ success: true, message: `created letter pair: ${letterPair}`, card });
    } else {
      const created = await prisma.sets.createManyAndReturn({
        data: setTypeMap[setType][set].map((letter: any) => ({
          letterPair: `${set}${letter}`,
          card: JSON.stringify(createEmptyCard()),
          setType,
        })),
        skipDuplicates: true, // Avoid errors if some records already exist
      });
      const cards = created.reduce((acc, { letterPair, card, log }) => {
        acc[letterPair] = { card };
        return acc;
      }, {} as Record<string, {}>);      
      
      return json({ success: true, message: `created set: ${set}`, cards });
    }
  } catch (error) {
    console.error("Error in add API:", error);
    return json({ error: "Failed to add items" }, { status: 500 });
  }
};

