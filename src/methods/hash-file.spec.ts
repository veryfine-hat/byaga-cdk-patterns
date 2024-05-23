import {getStoredHash, storeHash} from './hash-file';
import {writeFileSync} from "fs";
import {existsSync, readFileSync, ensureDirSync} from 'fs-extra'

jest.mock('fs');
jest.mock('fs-extra');
jest.mock('./get-source-directory', () => ({
    distributionRoot: '/mock/distribution/root',
    getBuildDirectory: jest.fn()
}));

describe('getStoredHash', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('retrieves stored hash when hash file exists', () => {
        const type = 'type';
        const id = 'id';
        const hash = 'hash';

        (existsSync as jest.Mock).mockReturnValue(true);
        (readFileSync as jest.Mock).mockReturnValueOnce(Buffer.from(hash));

        const result = getStoredHash(type, id);

        expect(result).toBe(hash);
    });

    it('returns empty string when hash file does not exist', () => {
        const type = 'type';
        const id = 'id';

        (existsSync as jest.Mock).mockReturnValue(false);
        (readFileSync as jest.Mock).mockReturnValueOnce('wrong');

        const result = getStoredHash(type, id);

        expect(result).toBe('');
    });
});

describe('storeHash', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('stores hash', () => {
        const type = 'type';
        const id = 'id';
        const hash = 'hash';

        storeHash(type, id, hash);

        expect(writeFileSync).toHaveBeenCalledWith('\\mock\\distribution\\root\\hash\\type-id-hash.txt', hash);
    });

    it('calls ensureDir on the folder containing the .txt file', () => {
        const type = 'type';
        const id = 'id';
        const hash = 'hash';

        storeHash(type, id, hash);

        expect(ensureDirSync).toHaveBeenCalledWith('\\mock\\distribution\\root\\hash');
    });
});