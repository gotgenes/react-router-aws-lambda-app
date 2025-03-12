import { BackendStack } from "./stacks/backend";
import { ContainerRepositoryStack } from "./stacks/container";
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

  const containerRepositoryProps = { ...props };
  const containerRepositoryStack = new ContainerRepositoryStack(
    app,
    "ReactRouterContainerRepository",
    containerRepositoryProps,
  );

  const backendProps = {
    containerRepository: containerRepositoryStack.repository,
    ...props,
  };

  const backendStack = new BackendStack(
    app,
    "ReactRouterBackend",
    backendProps,
  );

  const frontendProps = {
    lambdaURL: backendStack.lambdaURL,
    ...props,
  };
  new FrontendStack(app, "ReactRouterFrontend", frontendProps);
}
