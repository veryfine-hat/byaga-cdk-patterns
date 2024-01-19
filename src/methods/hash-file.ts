import {join, dirname} from 'path'
import {existsSync, readFileSync, ensureDirSync} from "fs-extra";
import {writeFileSync} from "fs";
import {distributionRoot, getBuildDirectory} from "./get-source-directory";

/**
 * The root directory for the hash.
 */
export const hashRoot = join(distributionRoot, "hash")

/**
 * Constructs the file path for the hash file.
 * @param {string} type - The type of the source code.
 * @param {string} id - The ID of the source code.
 * @returns {string} - The file path for the hash file.
 */
function getHashFilePath(type: string, id: string): string {
    return join(hashRoot, `${type}-${id}-hash.txt`)
}

/**
 * Retrieves the stored hash for the specified source code.
 * @param {string} type - The type of the source code.
 * @param {string} id - The ID of the source code.
 * @returns {string} - The stored hash, or an empty string if no hash is stored.
 */
export function getStoredHash(type: string, id: string): string {
    const hashFilePath = getHashFilePath(type, id)

    const folderExists = existsSync(getBuildDirectory(type, id))
    const hashFileExists = folderExists && existsSync(hashFilePath)
    return hashFileExists ? readFileSync(hashFilePath).toString() : ''
}

/**
 * Stores a hash for the specified source code.
 * @param {string} type - The type of the source code.
 * @param {string} id - The ID of the source code.
 * @param {string} hash - The hash to store.
 */
export function storeHash(type: string, id: string, hash: string): void {
    const hashFilePath = getHashFilePath(type, id)

    ensureDirSync(dirname(hashFilePath));
    writeFileSync(hashFilePath, hash);
}