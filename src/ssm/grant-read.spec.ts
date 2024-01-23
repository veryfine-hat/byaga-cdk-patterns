import {grantRead} from './grant-read';
import {get} from './parameter-cache';
import {IGrantable, PolicyStatement} from 'aws-cdk-lib/aws-iam';
import {IKey} from "aws-cdk-lib/aws-kms";

jest.mock('./parameter-cache', () => ({
    get: jest.fn(),
}));
jest.mock('aws-cdk-lib/aws-iam', () => ({
    PolicyStatement: jest.fn(),
    Effect: { ALLOW: 'ALLOW' },
}));
jest.mock('aws-cdk-lib/aws-kms', () => ({
    Key: jest.fn(),
}));

const name = 'name';
const grantee = {
    grantPrincipal: {
        addToPrincipalPolicy: jest.fn(),
    },
};
const parameter = {
    parameterArn: 'parameterArn',
    decryptWithKey: {
        grantDecrypt: jest.fn(),
    } as unknown as IKey
};

beforeEach(() => {
    jest.clearAllMocks();
    (get as jest.Mock).mockReturnValue(parameter);
});

it('grants read access to SSM parameter', () => {
    grantRead(name, grantee as unknown as IGrantable);

    expect(get).toHaveBeenCalledWith(name);
    expect(grantee.grantPrincipal.addToPrincipalPolicy).toHaveBeenCalledWith(expect.any(PolicyStatement));
    expect(parameter.decryptWithKey.grantDecrypt).toHaveBeenCalledWith(grantee);
});

it('does not grant decrypt permissions if decryptWithKey is not defined', () => {
    delete (parameter as Record<string, unknown>).decryptWithKey;

    grantRead(name, grantee as unknown as IGrantable);

    expect(get).toHaveBeenCalledWith(name);
    expect(grantee.grantPrincipal.addToPrincipalPolicy).toHaveBeenCalledWith(expect.any(PolicyStatement));
});