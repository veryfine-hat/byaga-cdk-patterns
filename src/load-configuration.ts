import * as yaml from 'js-yaml'
import * as fs  from "fs-extra"

/**
 * Interface for the stack configuration.
 */
export interface StackConfiguration {

}

/**
 * Loads the configuration for a given stage.
 * If the configuration file does not exist, an empty object is returned.
 * @param {string} stage - The stage for which to load the configuration. Defaults to the value of the STAGE environment variable, or "develop" if STAGE is not set.
 * @returns {StackConfiguration} The loaded configuration.
 */
export function loadConfiguration(stage: string = process.env.STAGE || "develop"): StackConfiguration {
    const path = `config/${stage}.yml`
    if (fs.existsSync(path)) {
        return yaml.load(fs.readFileSync(`config/${stage}.yml`).toString()) as StackConfiguration
    }
    return {};
}