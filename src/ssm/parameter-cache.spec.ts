import {get, store} from './parameter-cache';
import {SsmParameter} from "./SsmParameter";

let name: string;
let parameter: SsmParameter;

beforeEach(() => {
    // Clear the cache before each test

    name = 'name';
    parameter = {} as SsmParameter;
});


it('returns undefined if parameter does not exist in cache', () => {
    const result = get(name);

    expect(result).toBeUndefined();
});

it('returns parameter if it exists in cache', () => {
    store(name, parameter);

    const result = get(name);

    expect(result).toBe(parameter);
});