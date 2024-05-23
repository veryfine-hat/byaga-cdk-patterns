import {generateHash} from './generate-hash';
import * as fs from 'fs';

jest.mock('fs');

it('generates a combined hash for the provided file paths', () => {
    const filePaths = ['file1', 'file2'];
    const fileData = 'file data';
    const expectedHash = "67778fab6ea0118afea25f01774fb464f23ea12d8d096516a508f8171271396c";

    (fs.readFileSync as jest.Mock).mockReturnValue(fileData);

    const result = generateHash(filePaths);

    expect(result).toBe(expectedHash);
    expect(fs.readFileSync).toHaveBeenCalledTimes(filePaths.length);
    filePaths.forEach((filePath) => {
        expect(fs.readFileSync).toHaveBeenCalledWith(filePath);
    });
});