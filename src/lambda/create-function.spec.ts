import {createFunction, FunctionIntegrationProps} from "./create-function";
import {type FunctionProps, Runtime} from 'aws-cdk-lib/aws-lambda';
import {Duration} from 'aws-cdk-lib';

jest.unmock('./create-function');

beforeEach(() => {
    jest.clearAllMocks();
});

it('creates a new Function', () => {
    const id = 'id';
    const options: FunctionIntegrationProps = {
        funcProps: {
            runtime: Runtime.NODEJS_20_X,
            memorySize: 256,
            timeout: Duration.seconds(30),
        } as FunctionProps
    };

    const details = createFunction(id, options);

    expect(details.lambda).toEqual(expect.objectContaining({
        stack: {id: 'my-stack'},
        id: "ResourceId:StackStage:id",
        logGroup: {
            logGroupName: 'id-lambda-aws'
        },
        runtime: Runtime.NODEJS_20_X,
        memorySize: 256,
        timeout: Duration.seconds(30),
    }));
});

it('applies honeycomb settings to the lambda', () => {
    const id = 'id';
    const options: FunctionIntegrationProps = {
        funcProps: {
            runtime: Runtime.NODEJS_20_X,
            memorySize: 256,
            timeout: Duration.seconds(30),
        } as FunctionProps
    };

    const details = createFunction(id, options);

    expect(details.lambda).toEqual(expect.objectContaining({
        with: 'honeycomb'
    }));
});

it('creates a new FunctionIntegration instance with default memory and timeout', () => {
    const id = 'id';
    const options: FunctionIntegrationProps = {
        funcProps: {
            runtime: Runtime.NODEJS_20_X,
        } as FunctionProps
    };

    const details = createFunction(id, options);

    expect(details.lambda).toEqual(expect.objectContaining({
        "memorySize": 256,
        "timeout": '30s'
    }));
});