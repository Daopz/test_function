#!/usr/bin/env node
import 'source-map-support/register';
import { App } from '@aws-cdk/core';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new App();

new PipelineStack(app, 'PipelineStack', {
    env: { account: '507856266964', region: 'us-east-1'},
    
});

app.synth();
