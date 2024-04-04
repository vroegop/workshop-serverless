import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, PutCommand} from '@aws-sdk/lib-dynamodb';

const TableName = process.env.DDB_TABLE_NAME;
const dynamo = DynamoDBDocumentClient.from(
	new DynamoDBClient({}),
	{marshallOptions: {removeUndefinedValues: true}}
);

const headers = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST",
	"Access-Control-Allow-Headers": "*",
	'Content-Type': 'application/json'
};

export const handler = async (data) => {
	const Item = {id: new Date().toISOString(), value: data.body};

	await dynamo.send(new PutCommand({TableName, Item}));

	return {
		statusCode: 200,
		body: `Success writing to database: ${JSON.stringify(Item)}`,
		headers
	};
}