## I'm using an AWS account

https://aws.amazon.com/cli/

Solutions are all available in the `solution` branch. Simply `git fetch && git switch solution`.

Please make sure you have installed Node, NPM, AWS CLI and AWS CDK.

Run the command `aws configure sso` to make sure you can log in

Run the command `aws sso login --profile {profile}` to make sure you can deploy to CDK

## I want to use LocalStack (free)

https://aws.amazon.com/cli/

https://docs.localstack.cloud/getting-started/installation/

https://app.localstack.cloud/workspace/auth-token

Solutions are all available in the `solution` branch. Simply `git fetch && git switch solution`.

Please make sure you have installed Node, NPM, AWS CLI and AWS CDK. Also create a Localstack account and install
the local services.

    export LOCALSTACK_AUTH_TOKEN=<your-auth-token>

    npm install -g aws-cdk-local aws-cdk
    
    cdklocal --version

    pip install awscli-local[ver1]
    
    localstack start

You can then use the awslocal and cdklocal commands as if you are on AWS.