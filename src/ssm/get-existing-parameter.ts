import {StringParameter} from "aws-cdk-lib/aws-ssm";
import {get, store} from "./parameter-cache";
import {getCurrentStack, genStackResourceId} from "../cloud-formation";
import {SsmParameter, SsmParameterOptions} from "./SsmParameter";

/**
 * Retrieves an existing SSM parameter.
 * If the parameter is not in the cache, it references the parameter and stores it in the cache.
 * @param {string} name - The name of the parameter.
 * @param {SsmParameterOptions} [options] - The options for the parameter.
 * @returns {SsmParameter} The SSM parameter.
 */
export function getExistingParameter(name: string, options?: SsmParameterOptions): SsmParameter {
    let param: SsmParameter = get(name);
    if (!param) {
        param = referenceParameter(name, options)
        store(name, param)
    }
    return param;
}

/**
 * References an SSM parameter and returns it.
 * @param {string} name - The name of the parameter.
 * @param {SsmParameterOptions} [options] - The options for the parameter.
 * @returns {SsmParameter} The SSM parameter.
 */
function referenceParameter(name: string, options?: SsmParameterOptions): SsmParameter {
    if (name[0] !== '/') name = '/' + name

    const {stack} = getCurrentStack()
    const parameterName = `/${options?.parameterGroup ?? stack.stackName}${name}`
    return {
        shortName: name,
        parameterArn: `arn:aws:ssm:${stack.region}:${stack.account}:parameter${parameterName}`,
        decryptWithKey: options?.decryptWithKey,
        parameter: StringParameter.fromStringParameterName(stack, genStackResourceId(parameterName), parameterName)
    }
}