import {Construct} from "constructs";

export type FunctionProps = Record<string, never>
export const Runtime = new Proxy({}, {
    get: (target: Record<string, never>, property: string) => {
        if (property in target) {
            return target[property as string];
        } else {
            return property.toLowerCase().replaceAll('_', ':');
        }
    }
});

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