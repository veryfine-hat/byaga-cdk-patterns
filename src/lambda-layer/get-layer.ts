import {ILayerVersion, LayerVersion} from "aws-cdk-lib/aws-lambda"
import {getCurrentStack} from "../create-stack";
import {get, store} from "./layer-cache";
import {genStackResourceId} from "../generate-identifier";

export function getLayer(name: string, arn: string): ILayerVersion {
    let layer = get(arn)
    if (!layer) {
        layer = createLayer(name, arn)
        store(arn, layer)
    }
    return layer;
}

function createLayer(name: string, arn: string): ILayerVersion {
    const {stack} = getCurrentStack()
    return LayerVersion.fromLayerVersionArn(stack, genStackResourceId(name),  arn)
}