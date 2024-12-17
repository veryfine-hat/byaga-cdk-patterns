import {Construct} from "constructs";

export type FunctionProps = Record<string, never>
export const Runtime = {
    NODEJS_LATEST: 'nodejs:latest'
};

export const Code = {
    fromInline: jest.fn(() => ({fromInline: true})),
    fromAsset: jest.fn(path => ({"fromAsset": path}))
}

export const LayerVersion = {
    fromLayerVersionArn: jest.fn()
}

export const Function = jest.fn((stack: Construct, id: string, args: FunctionProps) => ({
    stack,
    id,
    logGroup: {
        logGroupName: 'log-group-name'
    },
    ...args
}))

LayerVersion.fromLayerVersionArn.mockImplementation((stack, id: string, arn: string) => ({id, arn}))