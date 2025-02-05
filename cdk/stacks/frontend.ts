import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import type { FunctionUrl } from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3Deployment from "aws-cdk-lib/aws-s3-deployment";
import type { Construct } from "constructs";

export interface FrontendStackProps extends cdk.StackProps {
  lambdaURL: FunctionUrl;
}

export class FrontendStack extends cdk.Stack {
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "RemixBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    new s3Deployment.BucketDeployment(this, "RemixBucketDeployment", {
      destinationBucket: bucket,
      sources: [s3Deployment.Source.asset("../site/build/client")],
    });
    const bucketOrigin = origins.S3BucketOrigin.withOriginAccessControl(bucket);

    const distribution = new cloudfront.Distribution(
      this,
      "RemixDistribution",
      {
        defaultBehavior: {
          origin: new origins.FunctionUrlOrigin(props.lambdaURL),
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        },
        additionalBehaviors: {
          "favicon.ico": {
            origin: bucketOrigin,
            viewerProtocolPolicy:
              cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          },
          "logo-*": {
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
    this.distribution = distribution;
    new cdk.CfnOutput(this, "CloudFront Domain", {
      value: distribution.domainName
        ? `https://${distribution.domainName}`
        : "Something went wrong with the deployment",
    });
  }
}
