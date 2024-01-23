import {buildTypeScript} from './build-typescript';
import * as child_process from 'child_process';
import * as fsExtra from 'fs-extra';
import * as installNodeModulesModule from './install-node-modules';

jest.mock("../copy-files")
jest.mock('child_process', () => ({
    execSync: jest.fn(),
}));

jest.mock('fs-extra', () => ({
    ensureDirSync: jest.fn(),
}));

jest.mock('./install-node-modules');

it('ensures build directory exists, installs node modules, and compiles TypeScript code', () => {
    const srcDir = 'src';
    const buildDir = 'build';

    buildTypeScript(srcDir, buildDir);

    expect(fsExtra.ensureDirSync).toHaveBeenCalledWith(buildDir);
    expect(installNodeModulesModule.installNodeModules).toHaveBeenCalledWith(srcDir);
    expect(child_process.execSync).toHaveBeenCalledWith(`npm run build -- --outDir ${buildDir}`, {
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