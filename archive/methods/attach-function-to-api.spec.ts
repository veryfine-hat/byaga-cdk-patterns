import {
    attachFunctionToApi,
    AttachFunctionToResourceProps,
    AttachFunctionToRestApiProps
} from './attach-function-to-api';
import {DeployStack} from '../DeployStack';
import {FunctionIntegration} from '../create-function';
import {RestApi} from '../RestApi';
import { Function} from 'aws-cdk-lib/aws-lambda';
import {IResource, JsonSchema, LambdaIntegration, Method, MethodOptions} from 'aws-cdk-lib/aws-apigateway';

jest.mock('aws-cdk-lib/aws-apigateway');

let stack: DeployStack;
let api: RestApi;
let resource: IResource;
let httpMethod: string;
let path: string;
let requestSchema: JsonSchema;
let methodOptions: MethodOptions;
let lambda: FunctionIntegration;
let method: Method

beforeEach(() => {
    jest.clearAllMocks();
    stack = {
        genId: jest.fn(),
        genName: jest.fn()
    } as unknown as DeployStack
    id = 'id';
    httpMethod = 'GET';
    path = '/path';
    methodOptions = {};
    method = ({
        method: 'method'
    }) as unknown as Method;
    lambda = ({
        function: ({
            functionName: 'function-name'
        } as unknown as Function),
        id: 'lambda-id'
    }) as unknown as FunctionIntegration;
    api = ({
        path: jest.fn()
    }) as unknown as RestApi;
    resource = ({
        resourceArn: 'resource-arn',
        addMethod: jest.fn(() => method),
        api
    }) as unknown as IResource;
});

it('attaches function to API when resource is not provided', () => {
    const props: AttachFunctionToRestApiProps = {
        api,
        httpMethod,
        path,
        requestSchema,
        methodOptions
    };

    (api.path as jest.Mock).mockReturnValue(resource);

    const result = attachFunctionToApi(stack, lambda, props);

    expect(result).toEqual(expect.objectContaining({
        resourceArn: `arn:aws:execute-api:us-test-1:123456789012:abcdefz/test/GET/example`,
        method,
        ...lambda
    }));
    expect(resource.addMethod).toHaveBeenCalledWith(httpMethod, expect.any(LambdaIntegration), expect.any(Object));
});

it('attaches function to resource when resource is provided', () => {
    const props: AttachFunctionToResourceProps = {
        resource,
        httpMethod,
        requestSchema,
        methodOptions
    };

    const result = attachFunctionToApi(stack, lambda, props);

    expect(result).toEqual({
        resourceArn: `arn:aws:execute-api:us-test-1:123456789012:abcdefz/test/POST/example-2`,
        method,
        ...lambda
    });
    expect(resource.addMethod).toHaveBeenCalledWith(httpMethod, expect.any(LambdaIntegration), expect.any(Object));
});