import {StackProps}  from 'aws-cdk-lib/core';

export interface IStackArguments extends StackProps {
    stage: string
    project: string
    owner: string
    region: string
}
export default IStackArguments