import {copyFiles} from './copy-files';
import * as fse from 'fs-extra';
import * as path from 'path';

jest.mock('fs-extra');
jest.mock('path');

it('copies files from source directory to build directory', () => {
    const files = ['file1', 'file2'];
    const srcDir = 'src';
    const buildDir = 'build';

    (path.relative as jest.Mock).mockImplementation((srcDir, filePath) => filePath);
    (path.resolve as jest.Mock).mockImplementation((buildDir, relativePath) => `${buildDir}/${relativePath}`);

    copyFiles(files, srcDir, buildDir);

    files.forEach((file) => {
        expect(fse.copySync).toHaveBeenCalledWith(file, `${buildDir}/${file}`);
    });
});