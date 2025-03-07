import * as cdk from "aws-cdk-lib";
import { Platform } from "aws-cdk-lib/aws-ecr-assets";
import * as lambda from "aws-cdk-lib/aws-lambda";
import type { Construct } from "constructs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export class BackendStack extends cdk.Stack {
  public readonly lambdaURL: lambda.FunctionUrl;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    const image = lambda.DockerImageCode.fromImageAsset(
      path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".."),
      {
        file: path.join("site", "Dockerfile"),
        platform: Platform.LINUX_ARM64,
      },
    );

    const backendLambda = new lambda.DockerImageFunction(
      this,
      "ReactRouterBackendLambda",
      {
        code: image,
        architecture: lambda.Architecture.ARM_64,
        environment: {
          NODE_ENV: "production",
          PORT: "8080",
          AWS_LAMBDA_EXEC_WRAPPER: "/opt/bootstrap",
          AWS_LWA_ENABLE_COMPRESSION: "true",
          AWS_LWA_INVOKE_MODE: "response_stream",
        },
      },
    );
    const lambdaURL = backendLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
    });

    const dockerBackendLambda = new lambda.DockerImageFunction(
      this,
      "ReactRouterDockerBackendLambda",
      {
        code: image,
        architecture: lambda.Architecture.ARM_64,
        environment: {
          NODE_ENV: "production",
          PORT: "8080",
          AWS_LAMBDA_EXEC_WRAPPER: "/opt/bootstrap",
          AWS_LWA_ENABLE_COMPRESSION: "true",
          AWS_LWA_INVOKE_MODE: "response_stream",
        },
      },
    );

    this.lambdaURL = dockerBackendLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
    });
  }
}
