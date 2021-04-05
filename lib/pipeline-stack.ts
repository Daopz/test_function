import {Construct, SecretValue, Stack, StackProps} from '@aws-cdk/core';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as pipelines from '@aws-cdk/pipelines';

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
            oauthToken: SecretValue.secretsManager('github-token'),
            owner: 'Daopz',
            repo: 'test-function',
        });

            // Builds our source code outlined above into a could assembly artifact
        const synthAction = pipelines.SimpleSynthAction.standardNpmSynth({
            sourceArtifact, // Where to get source code to build
            cloudAssemblyArtifact, // Where to place built source
            buildCommand: 'npm run build' // Language-specific build cmd
        });

         // The basic pipeline declaration. This sets the initial structure
        // of our pipeline
        const pipeline = new pipelines.CdkPipeline(this, 'Pipeline', {
            pipelineName: 'ServicePipeline',
            cloudAssemblyArtifact,
            sourceAction,
            synthAction
        });    
      
        
    }
}
