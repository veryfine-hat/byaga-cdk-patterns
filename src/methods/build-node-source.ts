import {existsSync, emptyDirSync} from "fs-extra";
import {getBuildDirectory, getSourceDirectory} from './get-source-directory'
import {getFiles} from "./get-files";
import {generateHash} from "./generate-hash";
import duration from "./duration";
import {buildEcmascript} from "./build-ecmascript";
import {buildTypescript} from "./build-typescript";
import {getStoredHash, storeHash} from "./hash-file";

/**
 * Builds the source code for a Node.js project.
 * @function buildNodeSource
 * @param {string} type - The type of the source code.
 * @param {string} id - The ID of the source code.
 * @returns - The build directory containing the resulting source code
 */
export function buildNodeSource(type: string, id: string): string {
    const srcDir = getSourceDirectory(type, id)
    const buildDir = getBuildDirectory(type, id)

    const files = getFiles(srcDir);
    const hash: string = generateHash(files);

    if (getStoredHash(type, id) === hash) return buildDir;

    const rmComplete = duration()
    if (existsSync(buildDir)) emptyDirSync(buildDir)
    console.log('Cleanup Duration (ms)', rmComplete())

    const isTypeScript = !!files.find(file => file.endsWith('tsconfig.json'))

    isTypeScript ? buildTypescript(srcDir, buildDir) : buildEcmascript(files, srcDir, buildDir);

    storeHash(type, id, hash)
    return buildDir
}