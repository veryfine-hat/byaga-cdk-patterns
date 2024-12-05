import {copyFiles} from "../copy-files";
import {installNodeModules} from "./install-node-modules";

/**
 * Builds ECMAScript files.
 * Copies the files from the source directory to the build directory and installs the necessary node modules.
 * @function buildEcmaScript
 * @param files - The files to build.
 * @param srcDir - The source directory.
 * @param buildDir - The build directory.
 */
export function buildEcmaScript(files: string[], srcDir: string, buildDir: string): void {
    // Copies the files from the source directory to the build directory
    copyFiles(files, srcDir, buildDir);
    // Installs the necessary node modules
    installNodeModules(buildDir, ['dev', 'optional', 'peer']);
}