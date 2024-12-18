import type { MetaFunction } from "@remix-run/node";
import { SetSelector } from "~/src/components/SetSelector";
import { ToReview } from "~/src/components/ToReview";
import { CORNERS, EDGES } from "~/src/utils/constants";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { IconButton, Typography, Button } from "@mui/material";
import { useState } from "react";
import { SettingsModal } from "~/src/components/SettingsModal";
import { Form, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { getUser } from "~/src/services/session.server";

// https://remix.run/docs/en/main/route/meta
export const meta: MetaFunction = () => [
  { title: "Remix Starter" },
  { name: "description", content: "Welcome to remix!" },
];

interface ILoaderData {
  user?: any; // TODO
}

export const loader: LoaderFunction = async ({ request }) => ({
  user: await getUser(request),
});

// TODO make summary show percentage in each state
// TODO show fraction of selected cases on set selectors
// TODO better loading components

// https://remix.run/docs/en/main/file-conventions/routes#basic-routes
export default function Index() {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const { user } = useLoaderData() as ILoaderData;

  return (
    <>
      {!user ? (
        <Form action={`/auth`} method="post" className="flex justify-center">
          <Button type="submit">Sign in with WCA</Button>
        </Form>
      ) : (
        <Form action={`/logout`} method="post" className="flex justify-center">
          <Button type="submit">Sign out</Button>
        </Form>
      )}
      <IconButton
        style={{ position: "absolute", top: "15px", right: "15px" }}
        aria-label="Settings"
        onClick={() => setSettingsModalOpen(true)}
      >
        <SettingsIcon />
      </IconButton>
      <Typography variant="h4" component="h1" sx={{ my: 2 }}>
        SR 3style
      </Typography>
      <ToReview setType={EDGES} />
      <ToReview setType={CORNERS} />
      <SetSelector setType={EDGES} user={user} />
      <SetSelector setType={CORNERS} user={user} />
      <SettingsModal
        open={settingsModalOpen}
        handleClose={() => setSettingsModalOpen(false)}
      />
    </>
  );
}
