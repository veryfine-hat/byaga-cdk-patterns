import {Code, LayerVersion, Runtime} from "aws-cdk-lib/aws-lambda";
import {DeployStack} from "./DeployStack";
import {LayerVersionOptions} from "aws-cdk-lib/aws-lambda/lib/layers";
import {Architecture} from "aws-cdk-lib/aws-lambda/lib/architecture";
import {buildNodeSource} from "./methods/build-node-source";
import duration from "./methods/duration";

/**
 * Interface for the properties of the NodeJsLambdaLayer class.
 */
interface NodeJsLambdaLayerProps extends LayerVersionOptions {
    readonly compatibleRuntimes?: Runtime[];
    readonly compatibleArchitectures?: Architecture[];
}

/**
 * Class representing a Node.js AWS Lambda layer.
 * Extends the LayerVersion class from the AWS CDK library.
 */
export class NodeJsLambdaLayer extends LayerVersion {
    /**
     * Constructs a new NodeJsLambdaLayer instance.
     * @param {DeployStack} stack - The deployment stack.
     * @param {string} id - The ID of the layer.
     * @param {NodeJsLambdaLayerProps} props - The properties of the layer.
     */
    constructor(stack: DeployStack, id: string, props: NodeJsLambdaLayerProps = {}) {
        console.log("Building Lambda Layer", id);
        const done = duration()
        const buildDir = buildNodeSource('lambda-layer', id, {subdirectory:'nodejs'})
        console.log('Build Duration (ms)', done())

        super(stack, stack.genId(id), {
            compatibleRuntimes: [Runtime.NODEJS_20_X],
            ...props,
            layerVersionName: stack.genName(id),
            code: Code.fromAsset(buildDir),

        });
        stack.set('lambda-layer', id, this)
    }
}