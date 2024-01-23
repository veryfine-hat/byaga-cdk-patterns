import {getCurrentStack} from "./create-stack";

/**
 * Generates a name by joining the provided strings with a hyphen.
 * Each string is converted to lowercase and any uppercase letters are replaced with a hyphen followed by the lowercase letter.
 * @param {...string} name - The strings to join.
 * @returns {string} The generated name.
 */
export function genName(...name: string[]): string {
    return replaceMultipleDashesWithSingleDash(name
        .filter(n => !!n)
        .map(removeSpecialCharacters)
        .map(toKebabCase)
        .join('-')
        .toLowerCase()
    )
}
/**
 * Generates an ID by joining the provided strings with a hyphen.
 * The first letter of the ID is capitalized and any hyphen followed by a letter is replaced with the uppercase letter.
 * @param {...string} name - The strings to join.
 * @returns {string} The generated ID.
 */
export function genId(...name: string[]): string {
    return toProperCase(genName(...name))
}

/**
 * Generates a resource name for a stack by joining the stack name, resource, and stage with a hyphen.
 * @param {...} resource - The resource.
 * @returns The generated resource name.
 */
export function genStackResourceName(...resource: string[]) {
    const stack = getCurrentStack()
    return genName(stack.name, ...resource, stack.stage)
}

/**
 * Generates a resource ID for a stack by joining the stack name, stage, and resource.
 * The first letter of the ID is capitalized and any hyphen followed by a letter is replaced with the uppercase letter.
 * @param {...} resource - The resource.
 * @returns The generated resource ID.
 */
export function genStackResourceId(...resource: string[]) {
    const stack = getCurrentStack()
    return genId(stack.name, ...resource, stack.stage)
}

function removeSpecialCharacters(name: string) {
    return name.replace(/[_/\\]/g, '-')
}

function replaceMultipleDashesWithSingleDash(name: string) {
    return name.replace(/-{2,}/g, '-');
}

function toKebabCase(name: string) {
    return name[0] + name.substring(1).replace(/[A-Z]/g, v => '-' + v.toLowerCase())
}
function toProperCase(name: string) {
    return name.split('-')
        .filter(n => !!n)
        .map(v => v[0].toUpperCase() + v.substring(1))
        .join('')
}