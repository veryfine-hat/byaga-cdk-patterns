import {generateHash} from './generate-hash';
import * as fs from 'fs';

jest.unmock('./generate-hash');
jest.mock('fs');
jest.mock('crypto', () => ({
    createHash: jest.fn(type => {
        let v = type
        return ({
            update: jest.fn(nv => v += '-' + nv),
            digest: jest.fn(() => v + 'hash')
        })
    })
}));

it('generates a combined hash for the provided file paths', () => {
    const filePaths = ['file1', 'file2'];
    const fileData = 'file data';
    const expectedHash = "sha256-sha256-file datahash-sha256-file datahashhash";

    (fs.readFileSync as jest.Mock).mockReturnValue(fileData);

    const result = generateHash(filePaths);

    expect(result).toBe(expectedHash);
    expect(fs.readFileSync).toHaveBeenCalledTimes(filePaths.length);
    filePaths.forEach((filePath) => {
        expect(fs.readFileSync).toHaveBeenCalledWith(filePath);
    });
});