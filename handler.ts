import { AWSProxy, createRequestHandler } from "remix-aws";
import * as build from "virtual:remix/server-build";

export const handler = createRequestHandler({
  build: build,
  mode: process.env.NODE_ENV,
  awsProxy: AWSProxy.APIGatewayV2,
});
