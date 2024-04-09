# Local testing

To execute your lambda locally for testing purposes, it requires the resources it needs (the DynamoDB table in this case)
to already be created and have a name either hardcoded or in the environment variables of your local machine.

Every time you change the lambda, you need to do `cdk synth` to build the deployment template and artifacts. 
If you work in typescript, you also need to build the code every time you update it. For javascript, 
I find this combination of commands is the easiest:

> cdk synth && sam local invoke --profile {profile-name} -t cdk.out/{stack-name}.template.json {lambda-name}

If you make changes to the stack with components that interface with the lambda such as another connected lambda, S3
bucket or database, make sure to re-deploy the stack before testing local execution. `cdk synth` does not deploy the 
changes but it does update your local cloudformation templates. Use `cdk deploy` for stack updates.
