import {buildEcmascript} from './build-ecmascript';
import * as copyFilesModule from './copy-files';
import * as installNodeModulesModule from './install-node-modules';

jest.mock('./copy-files');
jest.mock('./install-node-modules');

it('copies files and installs node modules', () => {
    const files = ['file1', 'file2'];
    const srcDir = 'src';
    const buildDir = 'build';

    buildEcmascript(files, srcDir, buildDir);

    expect(copyFilesModule.copyFiles).toHaveBeenCalledWith(files, srcDir, buildDir);
    expect(installNodeModulesModule.installNodeModules).toHaveBeenCalledWith(buildDir, ['dev', 'optional', 'peer']);
});