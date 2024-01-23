import {getExistingParameter} from "./get-existing-parameter";
import {SsmParameterOptions} from "./SsmParameter";

/**
 * Retrieves the string value of an existing SSM parameter.
 * @param {string} name - The name of the SSM parameter.
 * @param {SsmParameterOptions} [options] - The options for the SSM parameter.
 * @returns {string} The string value of the SSM parameter.
 */
export function stringValue(name: string, options?: SsmParameterOptions): string {
    return getExistingParameter(name, options).parameter.stringValue
}