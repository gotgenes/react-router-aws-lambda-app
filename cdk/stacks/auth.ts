import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import type { Construct } from "constructs";

export class AuthStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;

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
    this.userPool = userPool;

    const userPoolClient = userPool.addClient("remix-client", {
      authFlows: { adminUserPassword: true },
      oAuth: {
        flows: { authorizationCodeGrant: false, implicitCodeGrant: true },
      },
    });
    this.userPoolClient = userPoolClient;

    new cdk.CfnOutput(this, "Cognito User Pool", {
      value:
        userPool.userPoolProviderUrl ??
        "Something went wrong with the deployment",
    });
  }
}
