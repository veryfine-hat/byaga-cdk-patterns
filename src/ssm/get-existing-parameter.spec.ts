import {getExistingParameter} from './get-existing-parameter';
import {get, store} from './parameter-cache';
import {StringParameter} from 'aws-cdk-lib/aws-ssm';
import {SsmParameterOptions} from "./SsmParameter";
import {getCurrentStack} from "../cloud-formation";

jest.unmock('./get-existing-parameter');

const stack = {
    stackName: 'stackName',
    region: 'region',
    account: 'account',
};
const name = 'name';
const options = {
    decryptWithKey: {},
} as SsmParameterOptions;

beforeEach(() => {
    jest.clearAllMocks();
    (getCurrentStack as jest.Mock).mockReturnValue({stack});
});

it('returns parameter from cache if it exists', () => {
    const param = {name: 'preloaded'};
    (get as jest.Mock).mockReturnValueOnce(param);
    const result = getExistingParameter(name, options);

    expect(result).toBe(param);
    expect(get).toHaveBeenCalledWith(name);
    expect(store).not.toHaveBeenCalled();
});

it('references and stores parameter in cache if it does not exist', () => {
    const result = getExistingParameter(name, options);

    expect(result).toEqual({
        shortName: `/${name}`,
        "parameterArn": "arn:aws:ssm:region:account:parameter/stackName/name",
        decryptWithKey: options.decryptWithKey,
        parameter: expect.objectContaining({
            "id": "ResourceId:StackStage:/stackName/name",
            name: "/stackName/name"
        }),
    });
    expect(StringParameter.fromStringParameterName).toHaveBeenCalledWith(stack, "ResourceId:StackStage:/stackName/name", "/stackName/name");
});