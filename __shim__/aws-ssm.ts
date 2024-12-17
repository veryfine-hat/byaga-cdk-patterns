import {Construct} from "constructs";

export interface IStringParameter {
    stringValue: string
}

export class StringParameter {
    stringValue: string
    static fromStringParameterName(scope: Construct, id: string, stringParameterName: string): IStringParameter {
        const p = new StringParameter()
        p.stringValue = `${id}-${stringParameterName}`
        return p
    }
}