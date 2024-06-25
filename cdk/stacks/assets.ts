import * as cdk from "aws-cdk-lib";
import * as s3Deployment from "aws-cdk-lib/aws-s3-deployment";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class AssetsStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const bucket = new s3.Bucket(this, "RemixBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    this.bucket = bucket;
    new s3Deployment.BucketDeployment(this, "RemixBucketDeployment", {
      destinationBucket: bucket,
      sources: [s3Deployment.Source.asset("../site/build/client")],
    });
  }
}
