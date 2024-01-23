import {DeployStack} from "../DeployStack";
import {
    JsonSchema,
    LambdaIntegration,
    MethodOptions,
    IResource, Method
} from "aws-cdk-lib/aws-apigateway";
import {RestApi} from "../RestApi";
import {applySchemaToMethodOptions} from "./apply-schema-to-method-options";
import {FunctionIntegration} from "../create-function";

/**
 * Type alias for the properties when attaching a function to an API or a resource.
 */
type AttachFunctionToApiProps = AttachFunctionToRestApiProps | AttachFunctionToResourceProps

/**
 * Interface for the properties when attaching a function to an API.
 */
export interface AttachFunctionToRestApiProps {
    api: RestApi
    httpMethod: string
    path: string
    requestSchema?: JsonSchema,
    methodOptions?: MethodOptions
}

/**
 * Interface for the properties when attaching a function to a resource.
 */
export interface AttachFunctionToResourceProps {
    resource: IResource
    httpMethod: string
    requestSchema?: JsonSchema,
    methodOptions?: MethodOptions
}

export interface ApiAttachedFunction extends FunctionIntegration {
    resourceArn: string
    method: Method
}

/**
 * Attaches a function to an API or a resource.
 * @param {DeployStack} stack - The deployment stack.
 * @param lambda - The Function that is being attached
 * @param {AttachFunctionToApiProps} props - The properties for attaching the function.
 * @returns {ApiAttachPoint} The API attach point.
 */
export function attachFunctionToApi(stack: DeployStack, lambda: FunctionIntegration, props: AttachFunctionToApiProps) : ApiAttachedFunction {
    const resource: IResource = (props as AttachFunctionToResourceProps).resource || (props as AttachFunctionToRestApiProps).api.path((props as AttachFunctionToRestApiProps).path)
    const integration = new LambdaIntegration(lambda.function, {
        requestTemplates: {
            'application/json': '{ "statusCode": "200" }'
        }
    })

    let options: MethodOptions = props?.methodOptions || {}
    const schema = props?.requestSchema
    if (schema) options = applySchemaToMethodOptions(stack, lambda.id, schema, options, resource)

    const method = resource.addMethod(props.httpMethod, integration, options)

    return {
        ...lambda,
        method,
        resourceArn: `arn:aws:execute-api:${stack.region}:${stack.account}:${resource.api.restApiId}/${stack.stage}/${props.httpMethod}${resource.path}`
    };
}