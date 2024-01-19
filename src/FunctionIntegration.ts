import {DeployStack} from "./DeployStack";
import {Function, FunctionProps} from "aws-cdk-lib/aws-lambda";
import {
    JsonSchema,
    LambdaIntegration,
    MethodOptions,
    Model,
    RequestValidator,
    IResource, Method
} from "aws-cdk-lib/aws-apigateway";
import {CfnOutput, Duration} from "aws-cdk-lib";
import {applyHoneycombToLambda} from "./methods/apply-honeycomb-to-lambda";
import {RetentionDays} from "aws-cdk-lib/aws-logs";
import {RestApi} from "./RestApi";

interface AddToApiOptions {
    requestSchema?: JsonSchema,
    methodOptions?: MethodOptions
}

export interface FunctionIntegrationProps {
    funcProps: FunctionProps,
    timeout?: Duration
    memory?: number
}

export class FunctionIntegration extends Function {
    stack: DeployStack
    name: string

    constructor(stack: DeployStack, id: string, options: FunctionIntegrationProps) {
        const props = applyHoneycombToLambda(stack, {
            functionName: stack.genName(id),
            memorySize: options.memory || 256,
            timeout: options.timeout || Duration.seconds(16),
            logRetention: RetentionDays.ONE_WEEK,
            ...options.funcProps
        })

        super(stack, stack.genId(id, 'lambda'), props);
        this.stack = stack;
        this.name = id;
        stack.set('lambda', id, this)
        new CfnOutput(stack, stack.genId(id, 'function-name'), {
            value: this.functionName,
            exportName: stack.genName(id, 'function-name')
        });
    }

    attach(api: RestApi, httpMethod: string, path: string, props: AddToApiOptions = {}) : ApiAttachPoint {
        const resource: IResource = api.path(path)
        const integration = new LambdaIntegration(this, {
            requestTemplates: {
                'application/json': '{ "statusCode": "200" }'
            }
        })

        let options: MethodOptions = props?.methodOptions || {}
        const schema = props?.requestSchema
        if (schema) options = applySchema(this.stack, this.name, schema, options, resource)

        const method = resource.addMethod(httpMethod, integration, options)

        return {
            method,
            resourceArn: `arn:aws:execute-api:${this.stack.region}:${this.stack.account}:${api.restApiId}/${this.stack.stage}/${httpMethod}${path}`
        };
    }
}

function applySchema(stack: DeployStack, name: string, schema: JsonSchema, options: MethodOptions, path: IResource): MethodOptions {
    return {
        ...options,
        requestValidator: new RequestValidator(stack, stack.genId(name, 'validator'), {
            restApi: path.api,
            requestValidatorName: stack.genName(name, 'validator'),
            validateRequestBody: true
        }),
        requestModels: {
            'application/json': new Model(stack, stack.genId(name, 'model'), {
                schema: schema,
                contentType: 'application/json',
                restApi: path.api,
                modelName: stack.genId(name, 'model')
            })
        }
    }
}

interface ApiAttachPoint {
    method: Method
    resourceArn: string
}