import {stringValue} from './string-value';
import {getExistingParameter} from './get-existing-parameter';

jest.unmock('./string-value');

const name = 'name';
const options = {};
const parameter = {
    parameter: {
        stringValue: 'stringValue',
    },
};

beforeEach(() => {
    jest.clearAllMocks();
    (getExistingParameter as jest.Mock).mockReturnValue(parameter);
});

it('returns string value of existing SSM parameter', () => {
    const result = stringValue(name, options);

    expect(result).toBe(parameter.parameter.stringValue);
    expect(getExistingParameter).toHaveBeenCalledWith(name, options);
});

it('returns string value of existing SSM parameter without options', () => {
    const result = stringValue(name);

    expect(result).toBe(parameter.parameter.stringValue);
    expect(getExistingParameter).toHaveBeenCalledWith(name, undefined);
});