import {applySchemaToMethodOptions} from './apply-schema-to-method-options';
import {DeployStack} from '../DeployStack';
import {JsonSchema, MethodOptions, Model, RequestValidator, IResource} from 'aws-cdk-lib/aws-apigateway';

jest.mock('aws-cdk-lib/aws-apigateway');

let stack: DeployStack;
let name: string;
let schema: JsonSchema;
let options: MethodOptions;
let path: IResource;

beforeEach(() => {
    jest.clearAllMocks();
    stack = {
        genId: jest.fn(),
        genName: jest.fn()
    } as unknown as DeployStack;
    name = 'name';
    schema = {schema: {}} as JsonSchema;
    options = {};
    path = {} as unknown as IResource;
});

it('returns method options with schema applied', () => {
    const result = applySchemaToMethodOptions(stack, name, schema, options, path);

    expect(result).toEqual(expect.objectContaining({
        requestValidator: expect.any(RequestValidator),
        requestModels: {
            'application/json': expect.any(Model)
        }
    }));
});

it('does not overwrite existing method options', () => {
    options = {
        apiKeyRequired: true,
        operationName: 'operationName'
    };

    const result = applySchemaToMethodOptions(stack, name, schema, options, path);

    expect(result).toEqual(expect.objectContaining({
        apiKeyRequired: true,
        operationName: 'operationName',
        requestValidator: expect.any(RequestValidator),
        requestModels: {
            'application/json': expect.any(Model)
        }
    }));
});