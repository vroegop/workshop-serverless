# Welcome

Solutions are all available in the `solution` branch. Simply `git fetch && git switch solution`.

Please make sure you have installed Node, NPM, AWS CLI and AWS CDK.

Run the command `aws configure sso` to make sure you can login

Run the command `aws sso login --profile {profile}` to make sure you can deploy to CDK

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

# Bonus challenge: add AI into the mix

This challenge will not really add to your AWS skills but it certainly is cool to do!

OpenAI offers an API interface (creditcard required) which allows you to send a message and receive a response.
If you send your darts statistics with some context, the AI can become a commentator for you game!

Combine this with ElevenLabs to do text-to-voice (creditcard required) and you have live commentary via audio
during the game!

Both of those things are also possible via AWS, but I find the API of AWS for AI not very intuitive.
