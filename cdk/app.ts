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
  cdk.Tags.of(app).add("app", "RemixApp");
  const backendStack = new BackendStack(app, "RemixBackend", props);
  const assetsStack = new AssetsStack(app, "RemixAssets", props);
  const stackProps = {
    bucket: assetsStack.bucket,
    lambdaURL: backendStack.lambdaURL,
  };
  const frontendProps = { ...props, ...stackProps };
  new FrontendStack(app, "RemixFrontend", frontendProps);
}
