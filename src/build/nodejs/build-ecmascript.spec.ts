import {buildEcmaScript} from './build-ecmascript';
import {copyFiles} from '../copy-files';
import {installNodeModules} from './install-node-modules';

jest.unmock('./build-ecmascript');

it('copies files and installs node modules', () => {
    const files = ['file1', 'file2'];
    const srcDir = 'src';
    const buildDir = 'build';

    buildEcmaScript(files, srcDir, buildDir);

    expect(copyFiles).toHaveBeenCalledWith(files, srcDir, buildDir);
    expect(installNodeModules).toHaveBeenCalledWith(buildDir, ['dev', 'optional', 'peer']);
});