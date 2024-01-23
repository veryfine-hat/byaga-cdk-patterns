import {DeployStack} from "../DeployStack";
import {
    JsonSchema,
    MethodOptions,
    Model,
    RequestValidator,
    IResource
} from "aws-cdk-lib/aws-apigateway";

/**
 * Applies a schema to a method.
 * @param {DeployStack} stack - The deployment stack.
 * @param {string} name - The name of the method.
 * @param {JsonSchema} schema - The schema.
 * @param {MethodOptions} options - The method options.
 * @param {IResource} path - The path.
 * @returns {MethodOptions} The method options with the schema applied.
 */
export function applySchemaToMethodOptions(stack: DeployStack, name: string, schema: JsonSchema, options: MethodOptions, path: IResource): MethodOptions {
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

export default applySchemaToMethodOptions;