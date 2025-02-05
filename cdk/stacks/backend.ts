import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import type { Construct } from "constructs";

export class BackendStack extends cdk.Stack {
  public readonly lambdaURL: lambda.FunctionUrl;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    const backendLambda = new lambda.Function(this, "ReactRouterBackendLambda", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../site/build/server"),
      architecture: lambda.Architecture.ARM_64,
      environment: {
        NODE_ENV: "production",
      },
    });

    this.lambdaURL = backendLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });
  }
}
