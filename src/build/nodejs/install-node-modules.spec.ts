import {installNodeModules} from './install-node-modules';
import * as child_process from 'child_process';
import duration from "../../tools/duration";

jest.mock('child_process', () => ({
    execSync: jest.fn(),
}));
jest.mock('../../tools/duration', () => {
    const done = jest.fn()
    return () => done;
});
let logSpy: jest.SpyInstance;
beforeEach(() => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, 'log');
})

it('installs node modules in the specified directory', () => {
    const dir = 'dir';
    const omit = ['dev', 'optional'];

    installNodeModules(dir, omit);

    expect(child_process.execSync).toHaveBeenCalledWith(`npm i${omit.join(' --omit=')} --quite`, {
        cwd: dir
    });
});

it('installs node modules without omitting any types of dependencies', () => {
    const dir = 'dir';

    installNodeModules(dir);

    expect(child_process.execSync).toHaveBeenCalledWith(`npm i --quite`, {
        cwd: dir
    });
});

it('measures and logs the duration of the npm install command', () => {
    const dir = 'dir';
    const omit = ['dev', 'optional'];
    (duration() as unknown as jest.Mock).mockReturnValue(123);

    installNodeModules(dir, omit);

    expect(logSpy).toHaveBeenCalledWith('NPM Install Duration (ms)', 123);
});