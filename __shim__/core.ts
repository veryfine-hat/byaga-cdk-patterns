import {Construct, type IConstruct} from "constructs";

export interface StackProps {
    stackName?: string,
}

export class Stack extends Construct{
    stackName: string
    region: string = 'us-shim-1'
    account: string = '123456789012'
    constructor(scope: IConstruct, id: string, props: StackProps) {
        super(scope, id)

        this.stackName = id + props.stackName
    }

    tags = {
        _tags: [] as {key: string, value:string}[],
        setTag(key: string, value: string) {
            this._tags.push({key, value})
        }
    }
}

interface CfnOutputProps {
    value: string
    exportName: string
}

export class CfnOutput {
    value: string
    exportName: string

    constructor(scope: IConstruct, id: string, props: CfnOutputProps) {
        this.value = props.value
        this.exportName = props.exportName
    }
}

export class Duration {
    time: string
    static seconds(sec: number): Duration {
        const d = new Duration()
        d.time = `${sec}s`
        return d
    }
}

export class RemovalPolicy {
    static readonly DESTROY: 'DESTROY'
}