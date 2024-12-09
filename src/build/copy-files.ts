import * as path from 'path'
import * as fse from "fs-extra";
import {duration} from "../tools";

/**
 * Copies files from the source directory to the build directory.
 * @param files - List of files to copy.
 * @param src - Where the files are being copied from.
 * @param dest - Where the copies should be placed
 */
export function copyFiles(files: string[], src: string, dest: string): void {
    // Measure the duration of the copy process
    const copyComplete = duration()

    // For each file, calculate the relative path from the source directory,
    // resolve the target path in the build directory, and copy the file
    files.forEach((filePath) => {
        const relativePath = path.relative(src, filePath);
        const targetPath = path.resolve(dest, relativePath);
        fse.copySync(filePath, targetPath);
    });

    // Log the duration of the copy process
    console.log('Copy Duration (ms)', copyComplete())
}