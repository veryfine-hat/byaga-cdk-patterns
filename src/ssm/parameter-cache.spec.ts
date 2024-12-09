import {get, store} from './parameter-cache';
import {SsmParameter} from "./SsmParameter";

jest.unmock('./parameter-cache');


it('returns undefined if parameter does not exist in cache', () => {
    const result = get('name');

    expect(result).toBeUndefined();
});

it('returns parameter if it exists in cache', () => {
    const parameter = {} as SsmParameter;
    store('name', parameter);

    const result = get('name');

    expect(result).toBe(parameter);
});