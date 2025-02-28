import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as ssm from "aws-cdk-lib/aws-ssm";
import type { Construct } from "constructs";

export class BackendStack extends cdk.Stack {
  public readonly lambdaURL: lambda.FunctionUrl;
  public readonly originVerificationToken: ssm.IStringParameter;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const originVerificationToken =
      ssm.StringParameter.fromStringParameterAttributes(
        this,
        "ReactRouterOriginVerificationToken",
        { parameterName: "/react-router/origin-verification-token" },
      );
    const paramsAndSecrets = lambda.ParamsAndSecretsLayerVersion.fromVersion(
      lambda.ParamsAndSecretsVersions.V1_0_103,
    );

    const backendLambda = new lambda.Function(
      this,
      "ReactRouterBackendLambda",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "run.sh",
        code: lambda.Code.fromAsset("../site/build/server"),
        architecture: lambda.Architecture.ARM_64,
        layers: [
          lambda.LayerVersion.fromLayerVersionArn(
            this,
            "ReactRouterLambdaAdapterLayer",
            `arn:aws:lambda:${this.region}:753240598075:layer:LambdaAdapterLayerArm64:24`,
          ),
        ],
        environment: {
          AWS_LAMBDA_EXEC_WRAPPER: "/opt/bootstrap",
          AWS_LWA_ENABLE_COMPRESSION: "true",
          NODE_ENV: "production",
          ORIGIN_VERIFICATION_TOKEN: originVerificationToken.stringValue,
          PORT: "8080",
        },
        paramsAndSecrets,
      },
    );

    this.lambdaURL = backendLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });
    this.originVerificationToken = originVerificationToken;
  }
}
