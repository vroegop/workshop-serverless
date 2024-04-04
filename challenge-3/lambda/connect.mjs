import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';

const dynamo = DynamoDBDocument.from(new DynamoDB());
export const handler = async (event) => {
	const addConnectionParameters = {
		TableName: process.env.TABLE_NAME,
		Item: {
			connectionId: event.requestContext.connectionId,
			timestamp: new Date().toISOString()
		}
	};

	try {
		await dynamo.put(addConnectionParameters);
		return {statusCode: 200, body: 'Connected.'};
	} catch (err) {
		console.error('Error during onConnect:', err);
		return {statusCode: 500, body: 'Failed.'};
	}
};