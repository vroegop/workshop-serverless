Steps to set up the CDK code:

> mkdir challenge-1

> cd challenge-1 
 
> cdk init app --language=typescript

Install a level 3 construct to reduce complexity:

> npm i @aws-solutions-constructs/aws-lambda-dynamodb

Open lib/challenge-1-stack.ts and create a lambda:

```ts
import {LambdaToDynamoDB} from '@aws-solutions-constructs/aws-lambda-dynamodb';

// Place this code inside the constructor
// This automatically creates both a lambda and a DynamoDB table
const lambdaToDynamo = new LambdaToDynamoDB(this, 'darts-lambda-to-dynamo', {
	lambdaFunctionProps: {
		functionName: 'darts-score-lambda',
		code: Code.fromAsset(`lambda`),
		runtime: Runtime.NODEJS_18_X,
		handler: 'index.handler',
	},
	dynamoTableProps: {
		tableName: 'darts-score-table',
		partitionKey: { name: 'id', type: AttributeType.STRING },
	}
});

// Automate cleanup, also in the constructor
lambdaToDynamo.dynamoTable.applyRemovalPolicy(RemovalPolicy.DESTROY);
```

In that same file, create an API:

```ts
// This also goes into the constructor
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
	}
});
```

* In the root of the challenge-1 folder, create a folder called `lambda`
* In that folder create a file called `index.mjs` (the m stands for module which allows modern import statements)
* Create the lambda:

```ts
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, PutCommand} from '@aws-sdk/lib-dynamodb';

const TableName = 'darts-score-table';
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

	try {
		await dynamo.send(new PutCommand({TableName, Item}));

		return {
			statusCode: 200,
			body: `Success writing to database: ${JSON.stringify(Item)}`,
			headers
		};
	} catch (e) {
		return {
			statusCode: 500,
			body: `Error accessing DynamoDB table: ${JSON.stringify(e)}`,
			headers
		};
	}
}
```

Is this your first time? Then you need to prepare:

> aws configure sso

---

> aws sso login --profile {profile-here}

> cdk synth 

> cdk deploy

# Hooray!

Click yes a few times, check the console output for the URL and paste the URL in the `index.html` file.

