import {existsSync, emptyDirSync} from "fs-extra";
import {getBuildDirectory, getSourceDirectory} from '../get-source-directory'
import {getFiles} from "../get-files";
import {generateHash} from "../generate-hash";
import duration from "../../tools/duration";
import {buildEcmaScript} from "./build-ecmascript";
import {buildTypeScript} from "./build-typescript";
import {getStoredHash, storeHash} from "../hash-file";

export interface BuildOptions {
    subdirectory?: string
}

/**
 * Builds the source code for a Node.js project.
 * @function buildNodeSource
 * @param {string} type - The type of the source code.
 * @param {string} id - The ID of the source code.
 * @param {BuildOptions} [options] - Options for building the source code.
 * @returns - The build directory containing the resulting source code
 */
export function buildNodeSource(type: string, id: string, options?: BuildOptions): string {
    const srcDir = getSourceDirectory(type, id, options?.subdirectory)
    const buildDir = getBuildDirectory(type, id, options?.subdirectory)

    const files = getFiles(srcDir);
    const hash: string = generateHash(files);

    if (getStoredHash(type, id) === hash) return buildDir;

    const rmComplete = duration()
    if (existsSync(buildDir)) emptyDirSync(buildDir)
    console.log('Cleanup Duration (ms)', rmComplete())

    const isTypeScript = !!files.find(file => file.endsWith('tsconfig.json'))

    isTypeScript ? buildTypeScript(srcDir, buildDir) : buildEcmaScript(files, srcDir, buildDir);

    storeHash(type, id, hash)
    return buildDir
}