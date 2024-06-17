import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3Deployment from "aws-cdk-lib/aws-s3-deployment";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class RemixStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const backendLambda = new lambda.Function(this, "RemixLoginBackendLambda", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("build/server"),
      architecture: lambda.Architecture.ARM_64,
      environment: { NODE_ENV: "production" },
    });
    const backendLambdaURL = backendLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    const bucket = new s3.Bucket(this, "RemixBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    new s3Deployment.BucketDeployment(this, "RemixBucketDeployment", {
      destinationBucket: bucket,
      sources: [s3Deployment.Source.asset("build/client")],
    });

    const bucketOrigin = new origins.S3Origin(bucket);
    const cfDistribution = new cloudfront.Distribution(
      this,
      "RemixDistribution",
      {
        defaultBehavior: {
          origin: new origins.FunctionUrlOrigin(backendLambdaURL),
        },
        additionalBehaviors: {
          "favicon.ico": {
            origin: bucketOrigin,
            viewerProtocolPolicy:
              cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          },
          "/assets/*": {
            origin: bucketOrigin,
            viewerProtocolPolicy:
              cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          },
        },
      },
    );

    new cdk.CfnOutput(this, "Cloudfront Domain", {
      value: cfDistribution.domainName
        ? `https://${cfDistribution.domainName}`
        : "Something went wrong with the deploy",
    });
  }
}
