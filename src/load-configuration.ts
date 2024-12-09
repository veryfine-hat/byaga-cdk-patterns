import * as yaml from 'js-yaml'
import * as fs  from "fs-extra"

/**
 * Loads the configuration for a given stage.
 * If the configuration file does not exist, an empty object is returned.
 * @param stage - The stage for which to load the configuration. Defaults to the value of the STAGE environment variable, or "develop" if STAGE is not set.
 * @returns The loaded configuration.
 */
export function loadConfiguration<T extends object>(stage: string = process.env.STAGE || "develop"): T {
    const path = `config/${stage}.yml`
    if (fs.existsSync(path)) {
        return yaml.load(fs.readFileSync(`config/${stage}.yml`).toString()) as T
    }
    return {} as T;
}