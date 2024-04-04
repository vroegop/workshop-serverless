import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {AttributeType, BillingMode, Table} from 'aws-cdk-lib/aws-dynamodb';
import {CfnOutput} from 'aws-cdk-lib';
import {WebSocketApi, WebSocketStage} from 'aws-cdk-lib/aws-apigatewayv2';
import {WebSocketLambdaIntegration} from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import {Code, Runtime, Function} from 'aws-cdk-lib/aws-lambda';

export class Challenge3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new Table(this, 'MessagesTable', {
      tableName: "DartPlayers",
      partitionKey: {
        name: 'connectionId',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    const onConnectLambda = new Function(this, 'OnConnectLambda', {
      functionName: 'ConnectLambda',
      runtime: Runtime.NODEJS_20_X,
      handler: 'connect.handler',
      code: Code.fromAsset(`lambda`),
      environment: {
        TABLE_NAME: table.tableName
      }
    });

    const onDisconnectLambda = new Function(this, 'OnDisconnectLambda', {
      functionName: 'DisconnectLambda',
      runtime: Runtime.NODEJS_20_X,
      handler: 'disconnect.handler',
      code: Code.fromAsset(`lambda`),
      environment: {
        TABLE_NAME: table.tableName
      }
    });

    const sendMessageLambda = new Function(this, 'SendMessageLambda', {
      functionName: 'MessageLambda',
      runtime: Runtime.NODEJS_20_X,
      handler: 'message.handler',
      code: Code.fromAsset(`lambda`),
      environment: {
        TABLE_NAME: table.tableName
      }
    });

    table.grantReadWriteData(onConnectLambda);
    table.grantReadWriteData(onDisconnectLambda);
    table.grantReadWriteData(sendMessageLambda);

    const webSocketApi = new WebSocketApi(this, 'WebSocketApi', {
      connectRouteOptions: { integration: new WebSocketLambdaIntegration( 'connect', onConnectLambda ) },
      disconnectRouteOptions: { integration: new WebSocketLambdaIntegration('disconnect', onDisconnectLambda) },
      defaultRouteOptions: { integration: new WebSocketLambdaIntegration('message', sendMessageLambda ) }
    });

    webSocketApi.grantManageConnections(sendMessageLambda);

    const deploymentStage = new WebSocketStage(this, 'DevelopmentStage', {
      webSocketApi,
      stageName: 'dev',
      autoDeploy: true
    });

    // Output the WebSocket URL
    new CfnOutput(this, 'WebSocketUrl', { value: deploymentStage.url });
  }
}
