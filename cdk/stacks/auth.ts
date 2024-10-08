import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as ssm from "aws-cdk-lib/aws-ssm";
import type { Construct } from "constructs";

export class AuthStack extends cdk.Stack {
  public readonly userPoolIdParam: ssm.StringParameter;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, "RemixUserPool", {
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    new cdk.CfnOutput(this, "Cognito User Pool", {
      value:
        userPool.userPoolProviderUrl ??
        "Something went wrong with the deployment",
    });

    const userPoolIdParam = new ssm.StringParameter(
      this,
      "RemixUserPoolIdParam",
      {
        parameterName: "/remix/user-pool-id",
        stringValue: userPool.userPoolId,
      },
    );
    this.userPoolIdParam = userPoolIdParam;
  }
}
