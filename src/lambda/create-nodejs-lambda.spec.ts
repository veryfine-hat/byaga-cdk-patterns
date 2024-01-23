import {createNodeJsLambda} from './create-nodejs-lambda';
import {buildNodeSource} from '../build/nodejs/build-node-source';
import {Code, Runtime} from 'aws-cdk-lib/aws-lambda';
import duration from '../tools/duration';
import {createFunction} from "./create-function";
import {Duration} from "aws-cdk-lib";

jest.mock('./create-function');
jest.mock('../build/nodejs/build-node-source');
jest.mock('../tools/duration');
jest.mock('aws-cdk-lib/aws-lambda', () => ({
    Code: {
        fromAsset: jest.fn(),
    },
    Runtime: {
        NODEJS_20_X: 'nodejs-20.x',
    },
}));

const id = 'id';
const options = {
    funcProps: {
        runtime: Runtime.NODEJS_20_X,
        memorySize: 256,
        timeout: Duration.seconds(30),
    },
};

beforeEach(() => {
    jest.clearAllMocks();
    (buildNodeSource as jest.Mock).mockReturnValue('build-dir');
    (duration as jest.Mock).mockReturnValue(() => 1000);
    (Code.fromAsset as jest.Mock).mockReturnValue('code');
});

it('creates a new Node.js AWS Lambda function', () => {
    createNodeJsLambda(id, options);

    expect(buildNodeSource).toHaveBeenCalledWith('lambda', id);
    expect(Code.fromAsset).toHaveBeenCalledWith('build-dir');
    expect(createFunction).toHaveBeenCalledWith(id, expect.objectContaining({
        funcProps: expect.objectContaining({
            code: 'code',
            handler: `${id}.handler`,
            runtime: Runtime.NODEJS_20_X,
        }),
    }));
});

it('creates a new Node.js AWS Lambda function with default options', () => {
    createNodeJsLambda(id);

    expect(buildNodeSource).toHaveBeenCalledWith('lambda', id);
    expect(Code.fromAsset).toHaveBeenCalledWith('build-dir');
    expect(createFunction).toHaveBeenCalledWith(id, expect.objectContaining({
        funcProps: expect.objectContaining({
            code: 'code',
            handler: `${id}.handler`,
            runtime: Runtime.NODEJS_20_X,
        }),
    }));
});