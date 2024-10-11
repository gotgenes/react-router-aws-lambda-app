import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as ssm from "aws-cdk-lib/aws-ssm";
import type { Construct } from "constructs";

interface BackendStackProps extends cdk.StackProps {
  cognitoUserPoolId: string;
  cognitoUserPoolClientId: string;
}

export class BackendStack extends cdk.Stack {
  public readonly lambdaURL: lambda.FunctionUrl;

  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);
    const cookieSecret =
      ssm.StringParameter.fromSecureStringParameterAttributes(
        this,
        "RemixCookieSecret",
        {
          parameterName: "/remix/cookie-secret",
          version: 1,
        },
      );
    const paramsAndSecrets = lambda.ParamsAndSecretsLayerVersion.fromVersion(
      lambda.ParamsAndSecretsVersions.V1_0_103,
    );

    const backendLambda = new lambda.Function(this, "RemixBackendLambda", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../site/build/server"),
      architecture: lambda.Architecture.ARM_64,
      environment: {
        NODE_ENV: "production",
        COGNITO_USER_POOL_ID: props.cognitoUserPoolId,
        COGNITO_CLIENT_ID: props.cognitoUserPoolClientId,
      },
      paramsAndSecrets,
    });

    cookieSecret.grantRead(backendLambda);
    this.lambdaURL = backendLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });
  }
}
