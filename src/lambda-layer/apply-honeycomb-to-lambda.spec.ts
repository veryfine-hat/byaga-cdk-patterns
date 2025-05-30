import {Code, FunctionProps, Runtime, ILayerVersion} from 'aws-cdk-lib/aws-lambda'
import {applyHoneycombToLambda} from './apply-honeycomb-to-lambda';
import {DeployStack, getCurrentStack} from "../cloud-formation";
import {stringValue} from "../ssm";
import {Construct} from "constructs";
import {Stack} from "aws-cdk-lib/core";

let mockStack: DeployStack<object>;

jest.unmock('./apply-honeycomb-to-lambda')
jest.unmock('./get-layer')
jest.unmock("aws-cdk-lib/core")

const existingLayer = {} as ILayerVersion;
const props: FunctionProps = {
    functionName: 'functionName',
    runtime: Runtime.NODEJS_LATEST,
    handler: 'index.handler',
    code: Code.fromInline('exports.handler = function(event, ctx, cb) { return cb(null, "hi"); }'),
    environment: {existingVar: 'existingValue'},
    layers: [existingLayer]
};
// Mock the wrapper object instead of the LayerVersion class

beforeEach(() => {
    mockStack = {
        name: 'stackName',
        stage: 'stage',
        project: 'project',
        config: {},
        stack: new Stack({} as Construct, 'stackName', {stackName: 'string'})
    } as DeployStack<object>
    (getCurrentStack as jest.Mock).mockReturnValue(mockStack);
});

it('should add honeycomb layer to function props', () => {
    const result = applyHoneycombToLambda(props);
    expect(result.layers).toEqual(expect.arrayContaining([expect.objectContaining({
        arn: "arn:aws:lambda:us-shim-1:702835727665:layer:honeycomb-lambda-extension-x86_64-v11-1-1:1"
    })]));
});

it('should add honeycomb environment variables to function props', () => {
    (stringValue as jest.Mock).mockImplementation(name => {
        return `from-ssm-${name}`
    })
    const result = applyHoneycombToLambda(props);
    expect(result.environment).toEqual(expect.objectContaining({
        LIBHONEY_API_KEY: 'from-ssm-/honeycomb/api-key',
        LIBHONEY_DATASET: 'from-ssm-/honeycomb/dataset',
        LOGS_API_DISABLE_PLATFORM_MSGS: 'true'
    }));
});

it('should not overwrite existing layers in function props', () => {
    const result = applyHoneycombToLambda(props);
    expect(result.layers).toContain(existingLayer);
});

it('should not overwrite existing environment variables in function props', () => {
    const result = applyHoneycombToLambda(props);
    expect(result.environment).toEqual(expect.objectContaining({
        existingVar: 'existingValue'
    }));
});