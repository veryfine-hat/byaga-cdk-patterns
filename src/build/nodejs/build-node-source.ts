import {existsSync, emptyDirSync} from "fs-extra";
import {getBuildDirectory, getSourceDirectory} from '../get-source-directory'
import {getFiles} from "../get-files";
import {generateHash} from "../generate-hash";
import duration from "../../tools/duration";
import {buildEcmaScript} from "./build-ecmascript";
import {buildTypeScript} from "./build-typescript";
import {getStoredHash, storeHash} from "../hash-file";

/**
 * Additional Build options which can be used to customize the build process.
 */
export interface BuildOptions {
    /**
     * @prop subdirectory - optional subdirectory to build, useful for a-standard builds such as lambda-layers which nest the modules in a '/nodejs/' directory
     */
    subdirectory?: string
}

/**
 * Builds the source code for a Node.js project.
 * @function buildNodeSource
 * @param type - The type of the source code.
 * @param id - The ID of the source code.
 * @param options - Options for building the source code.
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

    if (isTypeScript) buildTypeScript(srcDir, buildDir)
    else buildEcmaScript(files, srcDir, buildDir)

    storeHash(type, id, hash)
    return buildDir
}