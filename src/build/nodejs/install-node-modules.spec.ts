import {installNodeModules} from './install-node-modules';
import * as child_process from 'child_process';
import duration from "../../tools/duration";

jest.unmock('./install-node-modules');
jest.mock('child_process');
beforeEach(() => {
    (duration as jest.Mock).mockReturnValue(() => 123)
    jest.spyOn(console, 'log').mockImplementation(() => {});
})

it('installs node modules in the specified directory', () => {
    const dir = 'dir';
    const omit = ['dev', 'optional'];

    installNodeModules(dir, omit);

    expect(child_process.spawnSync).toHaveBeenCalledWith('npm', ['i', '--omit=dev', '--omit=optional', '--quiet'], {
        cwd: dir,
        stdio: 'inherit'
    });
});

it('installs node modules without omitting any types of dependencies', () => {
    const dir = 'dir';

    installNodeModules(dir);

    expect(child_process.spawnSync).toHaveBeenCalledWith('npm', ['i', '--quiet'], {
        cwd: dir,
        stdio: 'inherit'
    });
});

it('measures and logs the duration of the npm install command', () => {
    const logSpy = jest.spyOn(console, 'log');
    const dir = 'dir';
    const omit = ['dev', 'optional'];

    installNodeModules(dir, omit);

    expect(logSpy).toHaveBeenCalledWith('NPM Install Duration (ms)', 123);
});