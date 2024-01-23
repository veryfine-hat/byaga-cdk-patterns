import {getExistingParameter} from './get-existing-parameter';
import {get, store} from './parameter-cache';
import {StringParameter} from 'aws-cdk-lib/aws-ssm';
import {SsmParameterOptions} from "./SsmParameter";
import {getCurrentStack} from "../create-stack";

jest.mock('./parameter-cache');
jest.mock('../create-stack');
jest.mock('aws-cdk-lib/aws-ssm', () => ({
    StringParameter: {
        fromStringParameterName: jest.fn(),
    },
}));

const stack = {
    stackName: 'stackName',
    region: 'region',
    account: 'account',
};
const name = 'name';
const options = {
    decryptWithKey: {},
} as SsmParameterOptions;
const parameter = {};

beforeEach(() => {
    jest.clearAllMocks();
    (get as jest.Mock).mockReturnValue(parameter);
    (getCurrentStack as jest.Mock).mockReturnValue({stack});
    (StringParameter.fromStringParameterName as jest.Mock).mockReturnValue(parameter)
});

it('returns parameter from cache if it exists', () => {
    const result = getExistingParameter(name, options);

    expect(result).toBe(parameter);
    expect(get).toHaveBeenCalledWith(name);
    expect(store).not.toHaveBeenCalled();
});

it('references and stores parameter in cache if it does not exist', () => {
    (get as jest.Mock).mockReturnValueOnce(undefined);

    const result = getExistingParameter(name, options);

    expect(result).toEqual({
        shortName: `/${name}`,
        "parameterArn": "arn:aws:ssm:region:account:parameter/stackName/name",
        decryptWithKey: options.decryptWithKey,
        parameter,
    });
    expect(StringParameter.fromStringParameterName).toHaveBeenCalledWith(stack, "StackNameName", "/stackName/name");
});