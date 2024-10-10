import { AssetsStack } from "./stacks/assets";
import { AuthStack } from "./stacks/auth";
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

  const authStack = new AuthStack(app, "RemixAuth", props);

  const backendProps = {
    cognitoUserPoolId: authStack.userPool.userPoolId,
    cognitoUserPoolClientId: authStack.userPoolClient.userPoolClientId,
    ...props,
  };
  const backendStack = new BackendStack(app, "RemixBackend", backendProps);

  const assetsStack = new AssetsStack(app, "RemixAssets", props);

  const frontendProps = {
    bucket: assetsStack.bucket,
    lambdaURL: backendStack.lambdaURL,
    ...props,
  };
  new FrontendStack(app, "RemixFrontend", frontendProps);
}
