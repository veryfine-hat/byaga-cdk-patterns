import {copyFiles} from "./copy-files";
import {installNodeModules} from "./install-node-modules";

/**
 * Builds ECMAScript files.
 * Copies the files from the source directory to the build directory and installs the necessary node modules.
 * @function buildEcmascript
 * @param {string[]} files - The files to build.
 * @param {string} srcDir - The source directory.
 * @param {string} buildDir - The build directory.
 */
export function buildEcmascript(files: string[], srcDir: string, buildDir: string) {
    // Copies the files from the source directory to the build directory
    copyFiles(files, srcDir, buildDir);
    // Installs the necessary node modules
    installNodeModules(buildDir, ['dev', 'optional', 'peer']);
}