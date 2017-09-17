# Realeyes face detection homework

## Installation

To install the application, open a terminal, navigate to the root folder of the application, then run the command: `npm install`

## Configuration

To use the application you need to set your credentials for your AWS account, in one of the following ways: [Setting credentials](http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html)

You can also optionally configure the application's port by setting the `PORT` environmental variable for your operating system,

## Usage

You can use the application by navigating to its root folder in a terminal and issuing one of the following commands:
* `npm start`: Starts the application
* `npm run dev`: Starts the application in developer mode. It means, that, when anything changes in the source files, the application gets restarted automaticaly

After starting the application you need to open a WebRTC-capable browser, and navigate to the <http://localhost:PORT> url, where PORT is the one you set in your environmental variables, or 3000, if you did not set anything.