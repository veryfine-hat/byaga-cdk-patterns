import { createHash} from 'crypto';
import { readFileSync} from 'fs';

/**
 * Generates a hash for each file in the provided file paths and combines them into a single hash.
 * @function generateHash
 * @param {string[]} filePaths - The file paths to generate hashes for.
 * @returns {string} - The combined hash of all the files.
 */
export function generateHash(filePaths: string[]): string {
    // Map over each file path
    const hashes = filePaths.map((filePath) => {
        // Create a new hash object
        const hash = createHash('sha256');
        // Read the file data
        const data = readFileSync(filePath);
        // Update the hash with the file data
        hash.update(data);
        // Compute the hash digest
        return hash.digest('hex');
    });

    // Create a new hash object for the combined hash
    const combinedHash = createHash('sha256');
    // Update the combined hash with each individual file hash
    hashes.forEach((hash) => combinedHash.update(hash));

    // Return the combined hash digest
    return combinedHash.digest('hex');
}