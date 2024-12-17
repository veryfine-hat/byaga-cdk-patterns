import type {ILayerVersion} from "aws-cdk-lib/aws-lambda";

const layerCache = new Map<string, ILayerVersion>();

export const get = layerCache.get

export const store = layerCache.set