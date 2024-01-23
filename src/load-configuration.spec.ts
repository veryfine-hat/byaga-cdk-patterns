import {loadConfiguration} from './load-configuration';
import * as yaml from 'js-yaml';
import * as fs from 'fs-extra';

jest.mock('js-yaml', () => ({
    load: jest.fn(),
}));
jest.mock('fs-extra', () => ({
    existsSync: jest.fn(),
    readFileSync: jest.fn(),
}));

const stage = 'stage';
const config = {};

beforeEach(() => {
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('config');
    (yaml.load as jest.Mock).mockReturnValue(config);
});

it('loads configuration for provided stage', () => {
    const result = loadConfiguration(stage);

    expect(fs.existsSync).toHaveBeenCalledWith(`config/${stage}.yml`);
    expect(fs.readFileSync).toHaveBeenCalledWith(`config/${stage}.yml`);
    expect(yaml.load).toHaveBeenCalledWith('config');
    expect(result).toBe(config);
});

it('loads configuration for default stage if stage is not provided', () => {
    process.env.STAGE = 'develop';

    const result = loadConfiguration();

    expect(fs.existsSync).toHaveBeenCalledWith('config/develop.yml');
    expect(fs.readFileSync).toHaveBeenCalledWith('config/develop.yml');
    expect(yaml.load).toHaveBeenCalledWith('config');
    expect(result).toBe(config);
});

it('returns empty object if configuration file does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const result = loadConfiguration(stage);

    expect(fs.existsSync).toHaveBeenCalledWith(`config/${stage}.yml`);
    expect(fs.readFileSync).not.toHaveBeenCalled();
    expect(yaml.load).not.toHaveBeenCalled();
    expect(result).toEqual({});
});