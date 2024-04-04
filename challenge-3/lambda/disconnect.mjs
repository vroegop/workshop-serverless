import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const dynamo = DynamoDBDocument.from(new DynamoDB());

export const handler = async (event) => {
	const deleteConnectionsParameters = {
		TableName: process.env.TABLE_NAME,
		Key: {
			connectionId: event.requestContext.connectionId
		}
	};

	try {
		await dynamo.delete(deleteConnectionsParameters);
		return {statusCode: 200, body: 'Disconnected.'};
	} catch (err) {
		console.error('Error during onDisconnect:', err);
		return {statusCode: 500, body: 'Failed.'};
	}
};