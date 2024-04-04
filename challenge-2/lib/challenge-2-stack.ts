import * as cdk from 'aws-cdk-lib';
import {CfnOutput} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as path from 'node:path';
import {BucketDeployment, Source} from 'aws-cdk-lib/aws-s3-deployment';
import {Bucket, HttpMethods} from 'aws-cdk-lib/aws-s3';

export class Challenge2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const websiteBucket = new Bucket(this, 'WebsiteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: true,
        restrictPublicBuckets: false
      },
      autoDeleteObjects: true,
      cors: [
        {
          allowedMethods: [HttpMethods.GET],
          allowedOrigins: ['*'],
        }
      ],
    });

    new BucketDeployment(this, 'DeployWebsite', {
      sources: [Source.asset(path.join(__dirname, '../website'))],
      destinationBucket: websiteBucket!,
    });

    new CfnOutput(this, 'websiteURL', {
      value: websiteBucket.bucketWebsiteUrl,
    });
  }
}
