import {SsmParameter} from "./SsmParameter";

// Cache for storing SSM parameters
const paramCache: Record<string, SsmParameter> = {}

/**
 * Retrieves an SSM parameter from the cache.
 * @param {string} name - The name of the SSM parameter.
 * @returns {SsmParameter} The SSM parameter.
 */
export function get(name:string) {
    return paramCache[name];
}

/**
 * Stores an SSM parameter in the cache.
 * @param {string} name - The name of the SSM parameter.
 * @param {SsmParameter} param - The SSM parameter to store.
 */
export function store(name: string, param: SsmParameter) {
    paramCache[name] = param;
}