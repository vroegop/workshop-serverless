Steps to set up the CDK code:

*from the root folder*

> mkdir challenge-2

> cd challenge-2
 
> cdk init app --language=typescript

Open lib/challenge-2-stack.ts and create a bucket, deploy the website to the bucket and export the URL

```ts
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
```

* In the root of the challenge-2 folder, create a folder called `website`
* In that folder add the `index.html`, `dartboard.js` and `dartboard.svg` files

> Note: the default CDK .gitignore ignores all .js files, you could add !website/dartboard.js

> npm run build

---

Is this your first time? Then you need to prepare:

> aws configure sso

---

> aws sso login --profile {profile-here}

> cdk deploy

# Hooray!

Click yes a few times, check the console output for the URL and open it in a browser!
