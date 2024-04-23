# Welcome

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


# (MEDIUM) Challenge 1: store the scores

* Create a lambda that receives the scores
* Change the web front-end to send the scores to the lambda
* Store the scores in a DynamoDB table

[docs/challenge-1.md](docs/challenge-1.md)

# (EASY) Challenge 2: host the front-end

*Note: this challenge does not require challenge 1 to be completed*

* Create a bucket with public access
* Distribute your files into the bucket
* Export the bucket URL

[docs/challenge-2.md](docs/challenge-2.md)

# (HARD) Challenge 3: make it multiplayer

To make this challenge easier and prevent being blocked by over-engineering, I recommend not combining this challenge
with challenge 1 and 2 for now. With that in mind, the multiplayer version 1 variant will not save any long term state.

You can always choose to combine all challenges if you succeeded making multiplayer communication possible first.

* Create a connection lambda for websockets
* Create a message lambda for websockets
* Create a disconnect lambda for websockets
* Create an API Gateway
* Create a DynamoDB table to manage websocket sessions
* Connect the front-end to the websocket lambda's
  * It is possible to host multiple games using unique session id's.
  * If one player scores, send a message to the websocket connection with the information.
  * Other players should see those messages as events.

[docs/challenge-3.md](docs/challenge-3.md)

# Bonus challenge: implement the multiplayer 2-player version with dart rules

The multiplayer version is nothing more than a chat system for scores. Everyone who joins your game
will only be able to send scores to the backend and see the updated scores but what we actually want
is a 2-player version of the game. Every time two people joined, a separate 'game-room' should be
created. This can be done by setting an ID for those two players in the database. If only one person
has a certain ID, then next player should get the same ID. If there are no unique ID's, a new game
ID can be created allowing two players to join a new game-room.

If you are too fast and completed all of this before the end of the workshop you can try to implement
CDK unit-tests which test your environment or write the darts game rules to see who won and if scores
are legally allowed (double finish for example). All code is yours to keep so you can even use the dart
application after this workshop if you would like! (Everything should be able to live in the free tier).

### DynamoDB (Free tier: always)

* 25 GB of Storage per month
* 25 provisioned write capacity units per month
* 25 provisioned read capacity units per month

### Lambda (Free tier: always)

* 1 million free requests per month
* 3.2 million seconds of compute time per month

## S3 (12 months free then pay per use)

Note our codebase is nowhere near 1GB, so 0.01 USD is more likely.

      Tiered price storage: 1 GB = 0.023 USD
      200 PUT requests in a month = 0.001 USD
      200 GET requests in a month = 0.0001 USD
      1 GB network traffic x 0.0007 USD = 0.0007 USD
      1 GB scan data x 0.002 USD = 0.002 USD
      0.023 USD + 0.0001 USD + 0.0007 USD + 0.002 USD = 0.03 USD
      S3 Standard cost (monthly): 0.03 USD