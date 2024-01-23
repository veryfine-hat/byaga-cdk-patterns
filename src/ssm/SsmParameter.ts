import {IStringParameter} from "aws-cdk-lib/aws-ssm";
import {IKey} from "aws-cdk-lib/aws-kms";


export interface SsmParameterOptions {
    decryptWithKey?: IKey,
    parameterGroup?: string
}

export interface SsmParameter {
    shortName: string
    parameterArn: string
    decryptWithKey?: IKey
    parameter: IStringParameter
}