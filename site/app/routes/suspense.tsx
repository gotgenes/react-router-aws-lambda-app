import React from "react";
import { Await, useLocation } from "react-router";

import type { Route } from "./+types/suspense";

export function loader({}: Route.LoaderArgs) {
  const revealed = new Promise((resolve) =>
    setTimeout(() => resolve("revealed!"), 2000),
  );
  return { revealed };
}

export default function Suspense({ loaderData }: Route.ComponentProps) {
  const location = useLocation();

  const { revealed } = loaderData;
  return (
    <div>
      <h1 className="text-2xl">Suspense Demo</h1>
      <h2 className="text-lg">The result is:</h2>
      <React.Suspense fallback={<p>loading&hellip;</p>} key={location.key}>
        <Await resolve={revealed}>{(data) => <p>{data}</p>}</Await>
      </React.Suspense>
    </div>
  );
}
