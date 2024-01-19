import * as path from 'path'
import * as fse from "fs-extra";
import duration from "./duration";

/**
 * Copies files from the source directory to the build directory.
 * @function copyFiles
 * @param {string[]} files - The files to copy.
 * @param {string} srcDir - The source directory.
 * @param {string} buildDir - The build directory.
 */
export function copyFiles(files: string[], srcDir: string, buildDir: string) {
    // Measure the duration of the copy process
    const copyComplete = duration()

    // For each file, calculate the relative path from the source directory,
    // resolve the target path in the build directory, and copy the file
    files.forEach((filePath) => {
        const relativePath = path.relative(srcDir, filePath);
        const targetPath = path.resolve(buildDir, relativePath);
        fse.copySync(filePath, targetPath);
    });

    // Log the duration of the copy process
    console.log('Copy Duration (ms)', copyComplete())
}