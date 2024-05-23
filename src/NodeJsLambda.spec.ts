import {NodeJsLambda} from './NodeJsLambda';
import {DeployStack} from './DeployStack';
import {FunctionProps, Runtime} from 'aws-cdk-lib/aws-lambda';
import {Duration} from 'aws-cdk-lib';
import {FunctionIntegration} from "./FunctionIntegration";
import {buildNodeSource} from "./methods/build-node-source";

jest.mock('./methods/build-node-source');
jest.mock('aws-cdk-lib/aws-lambda', () => ({
    Runtime: {
        NODEJS_18_X: 'nodejs-18.x',
        NODEJS_20_X: 'nodejs-20.x'
    },
    Function: jest.fn(),
    Code: {
        fromAsset: jest.fn(path => ({ "fromAsset": path }))
    }
}));
jest.mock('./methods/duration', () => {
    const done = jest.fn();
    return () => done;
});
jest.mock('./FunctionIntegration');

let stack: DeployStack;
beforeEach(() => {
    jest.clearAllMocks();
    stack = {
        genName: jest.fn() ,
        genId: jest.fn(),
    } as unknown as DeployStack
    (buildNodeSource as jest.Mock).mockReturnValue('build-dir');
});

it('creates a new Node.js Lambda function', () => {
    const id = 'id';
    const options = {
        runtime: Runtime.NODEJS_20_X,
        memorySize: 256,
        timeout: Duration.seconds(30),
    } as FunctionProps;

    new NodeJsLambda(stack, id, {funcProps: options});

    expect(buildNodeSource).toHaveBeenCalledWith('lambda', id);
});

it('will properly initialize the FunctionIntegration with the build source directory', () => {
    const stack = {} as DeployStack;
    const id = 'id';
    const options = {
        runtime: Runtime.NODEJS_20_X,
        memorySize: 256,
        timeout: Duration.seconds(30),
    } as FunctionProps;

    new NodeJsLambda(stack, id, {funcProps: options});

    expect(FunctionIntegration).toHaveBeenCalledWith(stack, id, expect.objectContaining({
        funcProps: expect.objectContaining({
            code: {
                fromAsset: 'build-dir',
            },
            handler: `${id}.handler`,
        })
    }));
});

it('should pass through any other options to the FunctionIntegration', () => {
    const stack = {} as DeployStack;
    const id = 'id';
    const options = {
        memorySize: 256,
        timeout: Duration.seconds(30),
        environment: { 'TEST': 'value'},
        layers: ['l1']
    } as unknown as FunctionProps;

    new NodeJsLambda(stack, id, {funcProps: options});

    expect(FunctionIntegration).toHaveBeenCalledWith(stack, id, expect.objectContaining({
        funcProps: expect.objectContaining(options)
    }));
});