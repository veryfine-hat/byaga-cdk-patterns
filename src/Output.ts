import {CfnOutput} from 'aws-cdk-lib/core';
import {DeployStack} from './DeployStack';

export class Output extends CfnOutput {
    constructor(stack: DeployStack, name: string, value: string) {
        super(stack, stack.genId(name, 'output'), {
            value,
            exportName: stack.genName(name)
        })
    }
}