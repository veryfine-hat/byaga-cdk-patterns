import { getSourceDirectory, getBuildDirectory } from './get-source-directory';
import { resolve } from 'path';

describe('getSourceDirectory', () => {
    it('should return the correct path when subdir is provided', () => {
        const type = 'type';
        const id = 'id';
        const subdir = 'subdir';
        const expectedPath = resolve(process.cwd(), `../src/${type}/${id}/${subdir}`);

        const result = getSourceDirectory(type, id, subdir);

        expect(result).toEqual(expectedPath);
    });

    it('should return the correct path when subdir is not provided', () => {
        const type = 'type';
        const id = 'id';
        const expectedPath = resolve(process.cwd(), `../src/${type}/${id}`);

        const result = getSourceDirectory(type, id);

        expect(result).toEqual(expectedPath);
    });
});

describe('getBuildDirectory', () => {
    it('should return the correct path when subdir is provided', () => {
        const type = 'type';
        const id = 'id';
        const subdir = 'subdir';
        const expectedPath = resolve(process.cwd(), `../dist/${type}/${id}/${subdir}`);

        const result = getBuildDirectory(type, id, subdir);

        expect(result).toEqual(expectedPath);
    });

    it('should return the correct path when subdir is not provided', () => {
        const type = 'type';
        const id = 'id';
        const expectedPath = resolve(process.cwd(), `../dist/${type}/${id}`);

        const result = getBuildDirectory(type, id);

        expect(result).toEqual(expectedPath);
    });
});