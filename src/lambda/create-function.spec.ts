import {createFunction, FunctionIntegrationProps} from "./create-function";
import {type FunctionProps, Runtime} from "aws-cdk-lib/aws-lambda";
import { Duration } from "aws-cdk-lib/core";
import {applyHoneycombToLambda} from "../lambda-layer";
import {createLogGroup} from "../cloud-watch";

jest.unmock('./create-function');

beforeEach(() => {
    jest.clearAllMocks();
    (applyHoneycombToLambda as jest.Mock).mockImplementation(p => ({...p, with: 'honeycomb'}));
    (createLogGroup as jest.Mock).mockImplementation((id: string, type: string) => ({logGroupName: `${id}-${type}-aws`}));
});

it('creates a new Function', () => {
    const id = 'id';
    const options: FunctionIntegrationProps = {
        funcProps: {
            runtime: Runtime.NODEJS_LATEST,
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
        runtime: Runtime.NODEJS_LATEST,
        memorySize: 256,
        timeout: Duration.seconds(30),
    }));
});

it('applies honeycomb settings to the lambda', () => {
    const id = 'id';
    const options: FunctionIntegrationProps = {
        funcProps: {
            runtime: Runtime.NODEJS_LATEST,
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
            runtime: Runtime.NODEJS_LATEST,
        } as FunctionProps
    };

    const details = createFunction(id, options);

    expect(details.lambda).toEqual(expect.objectContaining({
        "memorySize": 256,
        "timeout": '30s'
    }));
});