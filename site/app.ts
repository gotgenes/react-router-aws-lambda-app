import { createRequestHandler } from "@react-router/express";
import express from "express";
import "react-router";
// @ts-expect-error - virtual module provided by React Router at build time
// eslint-disable-next-line import/no-unresolved
import * as build from "virtual:react-router/server-build";

export const app = express();

app.use(
  createRequestHandler({
    build,
    mode: process.env.NODE_ENV,
  }),
);
