import {Code, LayerVersion, Runtime} from "aws-cdk-lib/aws-lambda";
import {DeployStack} from "./DeployStack";
import {LayerVersionOptions} from "aws-cdk-lib/aws-lambda/lib/layers";
import {Architecture} from "aws-cdk-lib/aws-lambda/lib/architecture";
import {buildNodeSource} from "./methods/build-node-source";
import duration from "./methods/duration";

interface NodeJsLambdaLayerProps extends LayerVersionOptions {
    readonly compatibleRuntimes?: Runtime[];
    readonly compatibleArchitectures?: Architecture[];
}

export class NodeJsLambdaLayer extends LayerVersion {
    constructor(stack: DeployStack, id: string, props: NodeJsLambdaLayerProps = {}) {
        console.log("Building Lambda Layer", id);
        const done = duration()
        const {buildDir} = buildNodeSource('lambda-layer', id, {dir:'nodejs'})
        console.log('Build Duration (ms)', done())

        super(stack, stack.genId(id), {
            ...props,
            layerVersionName: stack.genName(id),
            code: Code.fromAsset(buildDir)
        });
        stack.set('lambda-layer', id, this)
    }
}
