import {ILayerVersion} from "aws-cdk-lib/aws-lambda";

const layerCache: Record<string, ILayerVersion> = {}

export function get(name:string): ILayerVersion {
    return layerCache[name];
}

export function store(name: string, param: ILayerVersion) {
    layerCache[name] = param;
}