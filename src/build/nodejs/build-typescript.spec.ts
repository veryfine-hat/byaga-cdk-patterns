import {buildTypeScript} from './build-typescript';
import * as child_process from 'child_process';
import * as fsExtra from 'fs-extra';
import * as installNodeModulesModule from './install-node-modules';

jest.unmock('./build-typescript')
jest.mock('child_process')
jest.mock('../../tools', () => ({duration: jest.fn(() => () => 0)}));

beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => null);
})

it('ensures build directory exists, installs node modules, and compiles TypeScript code', () => {
    const srcDir = 'src';
    const buildDir = 'build';

    buildTypeScript(srcDir, buildDir);

    expect(fsExtra.ensureDirSync).toHaveBeenCalledWith(buildDir);
    expect(installNodeModulesModule.installNodeModules).toHaveBeenCalledWith(srcDir);
    expect(child_process.spawnSync).toHaveBeenCalledWith('npm', ['run', 'build', '--', '--outDir', buildDir], {
        cwd: srcDir,
        stdio: 'inherit'
    });
});

it('should install node modules in the destination directory', () => {
    const srcDir = 'src';
    const buildDir = 'build';

    buildTypeScript(srcDir, buildDir);

    expect(installNodeModulesModule.installNodeModules).toHaveBeenCalledWith(buildDir, ['dev', 'optional', 'peer']);
})