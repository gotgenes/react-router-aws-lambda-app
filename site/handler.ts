import { AWSProxy, createRequestHandler } from "react-router-aws";
import * as build from "virtual:react-router/server-build";

export const handler = createRequestHandler({
  build: build,
  mode: process.env.NODE_ENV,
  awsProxy: AWSProxy.FunctionURL,
});
