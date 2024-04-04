import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaToDynamoDB } from '@aws-solutions-constructs/aws-lambda-dynamodb';
import {
  AuthorizationType,
  Cors,
  LambdaRestApi,
  LogGroupLogDestination,
  MethodLoggingLevel
} from 'aws-cdk-lib/aws-apigateway';
import {RemovalPolicy} from 'aws-cdk-lib';
import {LogGroup} from 'aws-cdk-lib/aws-logs';

export class Challenge1Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaToDynamo = new LambdaToDynamoDB(this, 'darts-lambda-to-dynamo', {
      lambdaFunctionProps: {
        code: Code.fromAsset(`lambda`),
        runtime: Runtime.NODEJS_18_X,
        handler: 'index.handler',
      },
    });
    lambdaToDynamo.dynamoTable.applyRemovalPolicy(RemovalPolicy.DESTROY);


    new LambdaRestApi(this, 'ApiGatewayToLambdaPattern', {
      handler: lambdaToDynamo.lambdaFunction,
      proxy: true,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ['*'],
      },
      defaultMethodOptions: {
        authorizationType: AuthorizationType.NONE,
      },
      deployOptions: {
        accessLogDestination: new LogGroupLogDestination(new LogGroup(this, 'DartsLogs')),
        loggingLevel: MethodLoggingLevel.INFO,
      }
    });
  }
}