import * as lambda from "@aws-cdk/aws-lambda";
import * as events from "@aws-cdk/aws-events";
import * as sqs from '@aws-cdk/aws-sqs';
import * as targets from '@aws-cdk/aws-events-targets';
import * as cdk from '@aws-cdk/core';
import path = require('path');


export class TestFunctionStack extends cdk.Stack {
  
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'hello.handler',
      // code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
      code: new lambda.AssetCode(path.resolve(__dirname, 'handler')),
      
    });
    
    const rule = new events.Rule(this, 'rule', {
      eventPattern: {
        source: ["aws.ec2"],
      },
    });
    
    const queue = new sqs.Queue(this, 'Queue');
    
    rule.addTarget(new targets.LambdaFunction(hello, {
      deadLetterQueue: queue, // Optional: add a dead letter queue
      maxEventAge: cdk.Duration.hours(2), // Otional: set the maxEventAge retry policy
      retryAttempts: 2, // Optional: set the max number of retry attempts
    }));

  }
}
