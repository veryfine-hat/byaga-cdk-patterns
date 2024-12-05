import {spawnSync} from "child_process";
import duration from "../../tools/duration";

export type OmitType = 'dev' | 'optional' | 'peer' | string
/**
 * Installs node modules in a specified directory.
 *
 * This function runs the `npm install` command in the specified directory,
 * omitting certain types of dependencies if specified.
 * It also measures and logs the duration of the `npm install` command.
 *
 * @function installNodeModules
 * @param dir - The directory in which to run `npm install`.
 * @param omit - The types of dependencies to omit. Possible values are 'dev', 'optional', and 'peer'.
 */
export function installNodeModules(dir: string, omit: OmitType[] = []): void {
    // Start measuring the duration of the `npm install` command
    const installComplete = duration()
    // Run the `npm install` command in the specified directory, omitting certain types of dependencies if specified
    spawnSync('npm', ['i', ...omit.map(o => `--omit=${o}`), '--quiet'], {
        cwd: dir,
        stdio: 'inherit'
    });
    // Log the duration of the `npm install` command
    console.log('NPM Install Duration (ms)', installComplete())
}