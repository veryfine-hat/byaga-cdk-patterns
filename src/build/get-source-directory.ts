import { join, resolve } from 'path'

// The root directory for the source files
export const sourceRoot = resolve(process.cwd(), "../src");

// The root directory for the distribution files
export const distributionRoot = resolve(process.cwd(), "../dist");

/**
 * Returns the source directory path for a given type and id.
 * @param {string} type - The type of the source.
 * @param {string} id - The id of the source.
 * @param {string} [subdir=''] - An optional subdirectory.
 * @returns {string} The source directory path.
 */
export function getSourceDirectory(type: string, id: string, subdir: string = ''): string {
    return joinPopulated(sourceRoot, type, id, subdir)
}

/**
 * Returns the build directory path for a given type and id.
 * @param {string} type - The type of the build.
 * @param {string} id - The id of the build.
 * @param {string} [subdir=''] - An optional subdirectory.
 * @returns {string} The build directory path.
 */
export function getBuildDirectory(type: string, id: string, subdir: string = ''): string {
    return joinPopulated(distributionRoot, type, id, subdir)
}

/**
 * Joins the given parts into a path, ignoring any empty parts.
 * @param {...string} parts - The parts to join.
 * @returns {string} The joined path.
 */
function joinPopulated(...parts: string[]): string {
    return join(...parts.filter(part => !!part));
}