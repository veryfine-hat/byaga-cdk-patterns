import {DeployStack} from "./DeployStack";
import {IStringParameter, StringParameter} from "aws-cdk-lib/aws-ssm";
import {Effect, IGrantable, PolicyStatement} from "aws-cdk-lib/aws-iam";
import {IKey} from "aws-cdk-lib/aws-kms";

const paramCache: { [name: string]: IStringParameter } = {}

export interface SsmParameterOptions {
    decryptWithKey?: IKey,
    parameterGroup?: string
}

export class SsmParameter {
    parameterName: string
    parameterArn: string
    decryptWithKey?: IKey
    _stack: DeployStack

    constructor(stack: DeployStack, name: string, options?: SsmParameterOptions) {
        if (name[0] !== '/') name = '/' + name
        this.parameterName = `/${options?.parameterGroup ?? stack.name}${name}`;
        this.parameterArn = `arn:aws:ssm:${stack.region}:${stack.account}:parameter${this.parameterName}`
        this._stack = stack;
        this.decryptWithKey = options?.decryptWithKey
    }

    grantRead(grantee: IGrantable) {
        grantee.grantPrincipal.addToPrincipalPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['ssm:GetParameter'],
            resources: [this.parameterArn]
        }))
        if (this.decryptWithKey) {
            this.decryptWithKey.grantDecrypt(grantee)
        }
    }

    get stringValue() {
        return this.getParameter().stringValue
    }

    getParameter() {
        if (!paramCache[this.parameterArn]) {
            paramCache[this.parameterArn] = StringParameter.fromStringParameterName(this._stack, this._stack.genId(this.parameterName.substring(1).replace('/', '_')), this.parameterName)
        }
        return paramCache[this.parameterArn]
    }
}