import {Code, Function, FunctionProps, Runtime} from 'aws-cdk-lib/aws-lambda';
import {Duration} from 'aws-cdk-lib';
import {applyHoneycombToLambda} from "../lambda-layer";
import {DeployStack, getCurrentStack} from "../cloud-formation";
import {Construct} from "constructs";
import {createLogGroup} from "../cloud-watch";
import {createFunction, FunctionIntegrationProps} from "./create-function";

jest.mock('../lambda-layer/apply-honeycomb-to-lambda');
jest.mock('aws-cdk-lib/aws-lambda');
jest.mock('aws-cdk-lib/aws-logs');
jest.mock('aws-cdk-lib');
jest.mock("../cloud-formation/create-stack");
jest.mock("../cloud-watch/create-log-group")

let stack: DeployStack;
beforeEach(() => {
    jest.clearAllMocks();
    stack = {
        stack: {cdk: 'stack'}
    } as unknown as DeployStack
    (applyHoneycombToLambda as jest.Mock).mockImplementation(p => ({...p, with: 'honeycomb'}));
    (Runtime as unknown as Record<string, string>).NODEJS_18_X = 'nodejs-18.x';
    (Runtime as unknown as Record<string, string>).NODEJS_20_X = 'nodejs-20.x';
    (Code as unknown as Record<string, jest.Mock>).fromAsset = jest.fn(path => ({"fromAsset": path}));
    (getCurrentStack as jest.Mock).mockReturnValue(stack);
    (Function as unknown as jest.Mock).mockImplementation((stack: Construct, id: string, args: FunctionProps) => ({
        stack,
        id,
        logGroup: {
            logGroupName: 'log-group-name'
        },
        ...args
    }));
    (Duration.seconds as jest.Mock).mockImplementation(s => `${s}s`);
    (createLogGroup as jest.Mock).mockImplementation((id: string, type: string, options: Record<string, string>) => ({
        logGroupName: `${id}-${type}-${options?.category || 'aws'}`
    }));
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
        stack: {cdk: 'stack'},
        id: "IdLambda",
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