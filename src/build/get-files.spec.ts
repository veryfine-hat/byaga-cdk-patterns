import {getFiles} from './get-files';
import * as fs from 'fs';
import * as path from 'path';
import ignore from 'ignore';
import {sync} from 'glob';
import {relative} from "path";

jest.mock('fs');
jest.mock('path');
jest.mock('ignore', () => {
    const add = jest.fn();
    const ignores = jest.fn();
    return () => ({ add, ignores });
});
jest.mock('glob');

it('returns files from directory excluding ignored files', () => {
    const dir = 'dir';
    const ignoreFile = '.ignore';
    const ignoreFilePath = 'dir/.ignore';
    const ignoreFileContents = 'ignoreFileContents';
    const files = ['file1', 'file2'];

    (path.resolve as jest.Mock).mockReturnValue(ignoreFilePath);
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(ignoreFileContents);
    (sync as unknown as jest.Mock).mockReturnValue(files);
    (ignore().ignores as unknown as jest.Mock).mockReturnValue(false);

    const result = getFiles(dir, ignoreFile);

    expect(result).toEqual(files);
    expect(fs.existsSync).toHaveBeenCalledWith(ignoreFilePath);
    expect(fs.readFileSync).toHaveBeenCalledWith(ignoreFilePath, 'utf8');
    expect(sync).toHaveBeenCalledWith('**', {
        cwd: dir,
        nodir: true,
        dot: false,
        absolute: true
    });
});

it('returns files from directory excluding ignored files', () => {
    const dir = 'dir';
    const ignoreFile = '.ignore';
    const ignoreFilePath = 'dir/.ignore';
    const ignoreFileContents = 'ignoreFileContents';
    const files = ['file1', 'file2', 'file3'];

    (path.resolve as jest.Mock).mockReturnValue(ignoreFilePath);
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(ignoreFileContents);
    (sync as unknown as jest.Mock).mockReturnValue(files);
    (relative as jest.Mock).mockImplementation((dir, file) => dir + '_' + file);

    (ignore().ignores as unknown as jest.Mock).mockImplementation((file: string) => file === 'dir_file3');

    const result = getFiles(dir, ignoreFile);

    expect(result).toEqual(['file1', 'file2']);
    expect(fs.existsSync).toHaveBeenCalledWith(ignoreFilePath);
    expect(fs.readFileSync).toHaveBeenCalledWith(ignoreFilePath, 'utf8');
    expect(sync).toHaveBeenCalledWith('**', {
        cwd: dir,
        nodir: true,
        dot: false,
        absolute: true
    });
});