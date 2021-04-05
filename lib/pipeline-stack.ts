import {Construct, SecretValue, Stack, StackProps} from '@aws-cdk/core';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as pipelines from '@aws-cdk/pipelines';
import * as cdk from '@aws-cdk/core';

export class PipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

       
        // Defines the artifact representing the sourcecode
        const sourceArtifact = new codepipeline.Artifact(); 
        // Defines the artifact representing the cloud assembly 
        // (cloudformation template + all other assets)
        const cloudAssemblyArtifact = new codepipeline.Artifact();

        // Generates the source artifact from the repo we created in the last step
        const sourceAction = new codepipeline_actions.GitHubSourceAction({
            actionName: 'GitHub', // Any Git-based source control
            output: sourceArtifact, // Indicates where the artifact is stored
            oauthToken: cdk.SecretValue.secretsManager('github_token'),
            owner: 'daopz',
            repo: 'test_function',
            branch: 'main',
            trigger: codepipeline_actions.GitHubTrigger.WEBHOOK,
        });

            // Builds our source code outlined above into a could assembly artifact
        const synthAction = pipelines.SimpleSynthAction.standardNpmSynth({
            sourceArtifact, // Where to get source code to build
            cloudAssemblyArtifact, // Where to place built source
            buildCommand: 'npm run build && npm test', // Language-specific build cmd
        });

        const pipeline = new pipelines.CdkPipeline(this, 'Pipeline', {
            cloudAssemblyArtifact,
            sourceAction,
            synthAction,
        });
      
        
    }
}
