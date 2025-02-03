import { AWSProxy, createRequestHandler } from "remix-aws";
import * as build from "virtual:react-router/server-build";

export const handler = createRequestHandler({
  build: build,
  mode: process.env.NODE_ENV,
  awsProxy: AWSProxy.FunctionURL,
});
