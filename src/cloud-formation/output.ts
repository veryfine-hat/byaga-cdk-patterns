import {CfnOutput} from 'aws-cdk-lib/core';
import {genId, genName} from './generate-identifier';
import {getCurrentStack} from './create-stack';

export function output(name: string, value: string) {
    return new CfnOutput(getCurrentStack().stack, genId(name, 'output'), {
        value,
        exportName: genName(name)
    })
}