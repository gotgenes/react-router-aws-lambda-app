import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import { FunctionUrl } from "aws-cdk-lib/aws-lambda";
import { IBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export interface FrontendStackProps extends cdk.StackProps {
  bucket: IBucket;
  lambdaURL: FunctionUrl;
}

export class FrontendStack extends cdk.Stack {
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);

    const bucketOrigin = new origins.S3Origin(props.bucket);
    const distribution = new cloudfront.Distribution(
      this,
      "RemixDistribution",
      {
        defaultBehavior: {
          origin: new origins.FunctionUrlOrigin(props.lambdaURL),
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
    this.distribution = distribution;
    new cdk.CfnOutput(this, "CloudFront Domain", {
      value: distribution.domainName
        ? `https://${distribution.domainName}`
        : "Something went wrong with the deploy",
    });
  }
}
