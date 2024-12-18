// app/services/session.server.ts
import { createCookieSessionStorage, json } from "@remix-run/node";
import { prisma } from "./db.server";
import { Cards } from "../types";
import { setTypes } from "../utils/constants";
// import { User } from "~/types";

// TODO types

// export the whole sessionStorage object
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: ["s3cr3t"], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

// you can also export the methods individually for your own usage
export const { getSession, commitSession, destroySession } = sessionStorage;

export const getUser = async (request: Request): Promise<any> => {
  const session = await getSession(request.headers.get("Cookie"));

  // TODO get user from DB

  const user = session.get("user") || null;

  console.log({ user });

  if (!user) {
    return;
  }

  const results = await Promise.all(
    setTypes.map(async (setType) => {
      const sets = await prisma.sets.findMany({ where: { setType } });
      const cards = sets.reduce((acc, { letterPair, card }) => {
        acc[letterPair] = { card: JSON.parse(card) }; // Parse card JSON
        return acc;
      }, {} as Cards);

      return { setType, cards }; // Include setType in the result
    }),
  );

  // Combine results into a single response
  const combinedResult = results.reduce(
    (acc, { setType, cards }) => {
      acc[setType] = cards;
      return acc;
    },
    {} as Record<string, Cards>,
  );

  return {
    user,
    cards: combinedResult,
    isPremium: true, // TODO
  };
};
