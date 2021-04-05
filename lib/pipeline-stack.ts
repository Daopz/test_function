import * as cdk from '@aws-cdk/core';
import {Construct, SecretValue, Stack, StackProps} from '@aws-cdk/core';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { SimpleSynthAction, CdkPipeline } from "@aws-cdk/pipelines";

export class PipelineStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

       
        // Defines the artifact representing the sourcecode
        const sourceArtifact = new codepipeline.Artifact(); 
        // Defines the artifact representing the cloud assembly 
        // (cloudformation template + all other assets)
        const cloudAssemblyArtifact = new codepipeline.Artifact();

        // The basic pipeline declaration. This sets the initial structure
        // of our pipeline
        new CdkPipeline(this, 'Pipeline', {
            pipelineName: 'ServicePipeline',
            cloudAssemblyArtifact,
                       
        
            // Generates the source artifact from the repo we created in the last step
            sourceAction : new codepipeline_actions.GitHubSourceAction({
                actionName: 'GitHub', // Any Git-based source control
                output: sourceArtifact, // Indicates where the artifact is stored
                oauthToken: SecretValue.secretsManager('github_token'),
                owner: 'daopz',
                repo: 'test_function',
        }),

            // Builds our source code outlined above into a could assembly artifact
            synthAction: SimpleSynthAction.standardNpmSynth({
                sourceArtifact, // Where to get source code to build
                cloudAssemblyArtifact, // Where to place built source
                buildCommand: 'npm run build' // Language-specific build cmd
        })
     }); 
        
    }
}
