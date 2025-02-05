import { AssetsStack } from "./stacks/assets";
import { BackendStack } from "./stacks/backend";
import { FrontendStack } from "./stacks/frontend";
import * as cdk from "aws-cdk-lib";

export function buildApp(): void {
  const app = new cdk.App();
  const env = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  };
  const props = { env };
  cdk.Tags.of(app).add("app", "ReactRouterApp");

  const backendProps = { ...props };
  const backendStack = new BackendStack(app, "ReactRouterBackend", backendProps);

  const frontendProps = {
    lambdaURL: backendStack.lambdaURL,
    ...props,
  };
  new FrontendStack(app, "ReactRouterFrontend", frontendProps);
}
