import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';

const dynamo = DynamoDBDocument.from(new DynamoDB());

export const handler = async ({body, requestContext}) => {
	const messageData = JSON.parse(body);

	const sendMessage = (connectionId) => {
		const apiGatewayClient = new ApiGatewayManagementApiClient({
			endpoint: `https://${requestContext.domainName}/${requestContext.stage}`
		});
		const postCommand = new PostToConnectionCommand({
			ConnectionId: connectionId,
			Data: Buffer.from(JSON.stringify(messageData))
		});
		return apiGatewayClient.send(postCommand);
	};

	const connectionTableName = {
		TableName: process.env.TABLE_NAME
	};
	const connections = await dynamo.scan(connectionTableName);

	const sendMessagesToAllConnections = connections.Items?.map((item) =>
		sendMessage(item.connectionId)
	);

	try {
		await Promise.all(sendMessagesToAllConnections);
		return {statusCode: 200, body: 'Message sent.'};
	} catch (err) {
		console.error('Error during sendMessage:', err);
		return {statusCode: 500, body: 'Failed.'};
	}
};
