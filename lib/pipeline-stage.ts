import { PipelineStack } from './pipeline-stack';
import * as cdk from '@aws-cdk/core';

export class TestFunctionStage extends cdk.Stage {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

    const service = new PipelineStack(this, 'TestFunction', {
      tags: {
        Application: 'TestFunction',
        Environment: id
      }
        });
    }
}
