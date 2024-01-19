import { existsSync, readFileSync } from 'fs';
import {resolve, relative }from 'path';
import ignore from 'ignore';
import { sync } from 'glob';

/**
 * Returns an array of file paths from a directory, excluding files specified in an ignore file.
 *
 * @param {string} dir - The directory to get files from.
 * @param {string} [ignoreFile='.cdkignore'] - The ignore file in the directory. Defaults to '.cdkignore'.
 *
 * @returns {string[]} An array of file paths.
 */
export const getFiles = (dir: string, ignoreFile: string = '.cdkignore'): string[] => {
    // Create a new ignore manager
    const ig = ignore();
    // Resolve the path to the ignore file
    const ignoreFilePath = resolve(dir, ignoreFile);

    // If the ignore file exists, add its contents to the ignore manager
    if (existsSync(ignoreFilePath)) {
        ig.add(readFileSync(ignoreFilePath, 'utf8'));
    }

    // Get all files in the directory
    const files = sync('**', {
        cwd: dir,
        nodir: true,
        dot: false,
        absolute: true
    });

    // Filter out the files that should be ignored
    return files.filter(file => !ig.ignores(relative(dir, file)));
};