import {instance, mock} from 'ts-mockito';
import {DeployStack} from '../DeployStack';
import {Code, FunctionProps, ILayerVersion, LayerVersion, Runtime} from 'aws-cdk-lib/aws-lambda';
import {applyHoneycombToLambda} from './apply-honeycomb-to-lambda';
import SpyInstance = jest.SpyInstance;

let mockStack: DeployStack;
let mockLayer: ILayerVersion;
let fromLayerVersionArn: SpyInstance;

jest.mock('../SsmParameter', () => {
    const {SsmParameter} = jest.requireActual('../SsmParameter');
    class MockSsmParameter extends SsmParameter {
        static mocks = {
            stringValue: jest.fn()
        }
        get stringValue(): string {
            return MockSsmParameter.mocks.stringValue();
        }
    }
    MockSsmParameter.mocks.stringValue.mockReturnValue('test-value');
    return {SsmParameter: MockSsmParameter }
})

const existingLayer = instance(mock(LayerVersion));
const props: FunctionProps = {
    runtime: Runtime.NODEJS_18_X,
    handler: 'index.handler',
    code: Code.fromInline('exports.handler = function(event, ctx, cb) { return cb(null, "hi"); }'),
    environment: {existingVar: 'existingValue'},
    layers: [existingLayer]
};
// Mock the wrapper object instead of the LayerVersion class

beforeEach(() => {
    mockStack = mock(DeployStack);
    mockLayer = mock(LayerVersion);
    fromLayerVersionArn = jest.spyOn(LayerVersion, 'fromLayerVersionArn').mockReturnValue(mockLayer);

});

afterEach(() => {
    fromLayerVersionArn.mockRestore();
})

it('should add honeycomb layer to function props', () => {
    const result = applyHoneycombToLambda(instance(mockStack), props);
    expect(result.layers).toContain(mockLayer);
});

it('should add honeycomb environment variables to function props', () => {
    const result = applyHoneycombToLambda(instance(mockStack), props);
    expect(result.environment).toEqual(expect.objectContaining({
        LIBHONEY_API_KEY: 'test-value',
        LIBHONEY_DATASET: 'test-value',
        LOGS_API_DISABLE_PLATFORM_MSGS: 'true'
    }));
});

it('should not overwrite existing layers in function props', () => {
    const result = applyHoneycombToLambda(instance(mockStack), props);
    expect(result.layers).toContain(existingLayer);
});

it('should not overwrite existing environment variables in function props', () => {
    const result = applyHoneycombToLambda(instance(mockStack), props);
    expect(result.environment).toEqual(expect.objectContaining({
        existingVar: 'existingValue'
    }));
});