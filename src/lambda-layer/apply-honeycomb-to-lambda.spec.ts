import {Code, FunctionProps, ILayerVersion, LayerVersion, Runtime} from 'aws-cdk-lib/aws-lambda';
import {applyHoneycombToLambda} from './apply-honeycomb-to-lambda';
import SpyInstance = jest.SpyInstance;
import {DeployStack, getCurrentStack} from "../create-stack";
import {stringValue} from "../ssm";

let mockStack: DeployStack;
let mockLayer: ILayerVersion;
let fromLayerVersionArn: SpyInstance;

jest.mock('../ssm')
jest.mock('../create-stack')

const existingLayer = {} as ILayerVersion;
const props: FunctionProps = {
    runtime: Runtime.NODEJS_18_X,
    handler: 'index.handler',
    code: Code.fromInline('exports.handler = function(event, ctx, cb) { return cb(null, "hi"); }'),
    environment: {existingVar: 'existingValue'},
    layers: [existingLayer]
};
// Mock the wrapper object instead of the LayerVersion class

beforeEach(() => {
    mockStack = {
        stack: {
            region: 'us-test-1'
        }
    } as DeployStack
    mockLayer = {} as ILayerVersion;
    fromLayerVersionArn = jest.spyOn(LayerVersion, 'fromLayerVersionArn').mockReturnValue(mockLayer);
    (getCurrentStack as jest.Mock).mockReturnValue(mockStack);
});

afterEach(() => {
    fromLayerVersionArn.mockRestore();
})

it('should add honeycomb layer to function props', () => {
    const result = applyHoneycombToLambda(props);
    expect(result.layers).toContain(mockLayer);
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