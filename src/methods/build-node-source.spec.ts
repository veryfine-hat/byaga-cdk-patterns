import {buildNodeSource} from './build-node-source';
import * as hashFileModule from './hash-file';
import {buildTypescript} from "./build-typescript";
import {buildEcmascript} from "./build-ecmascript";
import {getFiles} from "./get-files";
import {getBuildDirectory, getSourceDirectory} from "./get-source-directory";
import {generateHash} from "./generate-hash";
import {getStoredHash} from "./hash-file";

jest.mock('./hash-file');
jest.mock('./get-source-directory');
jest.mock('./get-files');
jest.mock('./generate-hash');
jest.mock('./build-ecmascript');
jest.mock('./build-typescript');

beforeEach(() => {
    jest.clearAllMocks();
    (getFiles as jest.Mock).mockReturnValue(['file1', 'file2']);
    (getBuildDirectory as jest.Mock).mockReturnValue('T:/build-dir/');
    (getSourceDirectory as jest.Mock).mockReturnValue('S:/src-dir/');
    (generateHash as jest.Mock).mockReturnValue('hash');
    (getStoredHash as jest.Mock).mockReturnValue('oldHash');
})

it('returns build directory', () => {
    const type = 'type';
    const id = 'id';

    const result = buildNodeSource(type, id);

    expect(result).toEqual('T:/build-dir/');
});

it('does not store hash if source has not changed', () => {
    const type = 'type';
    const id = 'id';

    (getStoredHash as jest.Mock).mockReturnValue('hash');
    buildNodeSource(type, id);

    expect(hashFileModule.storeHash).not.toHaveBeenCalled();
});

it('stores hash if source has changed', () => {
    const type = 'type';
    const id = 'id';

    buildNodeSource(type, id);

    expect(hashFileModule.storeHash).toHaveBeenCalledWith(type, id, 'hash');
});

it('builds typescript if typescript files are present', () => {
    const type = 'type';
    const id = 'id';

    (getFiles as jest.Mock).mockReturnValue(['file1', '/tsconfig.json']);

    buildNodeSource(type, id);

    expect(buildTypescript).toHaveBeenCalledWith('S:/src-dir/', 'T:/build-dir/');
});

it('builds ecmascript if typescript files are not present', () => {
    const type = 'type';
    const id = 'id';

    (getFiles as jest.Mock).mockReturnValue(['file1', 'file2']);

    buildNodeSource(type, id);

    expect(buildEcmascript).toHaveBeenCalledWith(getFiles(''), 'S:/src-dir/', 'T:/build-dir/');
});