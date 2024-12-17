import {Construct, type IConstruct} from "constructs";

export interface StringParameterProps {
    readonly stringValue: string
}

export class StringParameter extends Construct {
    stringValue: string

    static fromStringParameterName(scope: IConstruct, id: string, parameterName: string): StringParameter {
        return new StringParameter(scope, id, { stringValue: parameterName });
    }

    constructor(scope: IConstruct, id: string, props: StringParameterProps) {
        super(scope, id);
        this.stringValue = props.stringValue;
    }
}