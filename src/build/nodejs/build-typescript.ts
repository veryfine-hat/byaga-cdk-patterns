import { execSync } from 'child_process';
import duration from "../../tools/duration";
import {ensureDirSync} from "fs-extra";
import {installNodeModules} from "./install-node-modules";
import {copyFiles} from "../copy-files";
import {resolve} from 'path';

/**
 * Builds TypeScript source code.
 * Ensures the build directory exists, installs necessary node modules, and compiles the TypeScript code.
 * @function buildTypeScript
 * @param {string} srcDir - The source directory containing the TypeScript code.
 * @param {string} buildDir - The output directory for the compiled JavaScript code.
 */
export function buildTypeScript(srcDir: string, buildDir: string) {
    // Ensure the build directory exists
    ensureDirSync(buildDir);

    // Install necessary node modules
    installNodeModules(srcDir);

    // Measure the duration of the build process
    const done = duration()

    // Compile the TypeScript code
    execSync(`npm run build -- --outDir ${buildDir}`, {
        cwd: srcDir,
        stdio: 'inherit'
    });


    // Manually Move the package.json and install prod dependencies
    copyFiles([
        resolve(srcDir, 'package.json'),
        resolve(srcDir, 'package-lock.json'),
    ], srcDir, buildDir);
    installNodeModules(buildDir, ['dev', 'optional', 'peer']);

    // Log the duration of the build process
    console.log('NPM Install Duration (ms)', done())
}