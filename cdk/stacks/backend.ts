import * as cdk from "aws-cdk-lib";
import type { IRepository } from "aws-cdk-lib/aws-ecr";
import * as lambda from "aws-cdk-lib/aws-lambda";
import type { Construct } from "constructs";

export interface BackendStackProps extends cdk.StackProps {
  containerRepository: IRepository;
}

export class BackendStack extends cdk.Stack {
  public readonly lambdaURL: lambda.FunctionUrl;

  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);
    const repository = props.containerRepository;
    const image = lambda.DockerImageCode.fromEcr(repository);

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
    this.lambdaURL = backendLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
    });
  }
}
