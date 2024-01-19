import {execSync} from "child_process";
import duration from "./duration";

/**
 * Installs node modules in a specified directory.
 *
 * This function runs the `npm install` command in the specified directory,
 * omitting certain types of dependencies if specified.
 * It also measures and logs the duration of the `npm install` command.
 *
 * @function installNodeModules
 * @param {string} dir - The directory in which to run `npm install`.
 * @param {string[]} [omit=[]] - The types of dependencies to omit. Possible values are 'dev', 'optional', and 'peer'.
 */
export function installNodeModules(dir: string, omit: string[] = []) {
    // Start measuring the duration of the `npm install` command
    const installComplete = duration()
    // Run the `npm install` command in the specified directory, omitting certain types of dependencies if specified
    execSync(`npm i${omit.join(' --omit=')} --quite`, {
        cwd: dir
    });
    // Log the duration of the `npm install` command
    console.log('NPM Install Duration (ms)', installComplete())
}