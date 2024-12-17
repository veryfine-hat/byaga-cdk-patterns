import {Duration} from "./core";
import type {IConstruct, Construct} from "constructs";
import type {LogGroup} from "./aws-logs";

export type LayerVersionProps = object

export class LayerVersion {
    layerVersionArn: string
    static fromLayerVersionArn(scope: Construct, id: string, arn: string): ILayerVersion {
        return new LayerVersion(scope, id, { arn });
    }

    constructor(scope: Construct, id: string, props: LayerVersionProps) {
        this.layerVersionArn = id + JSON.stringify(props)
    }
}

export type ILayerVersion = object

export class Code {
    code: string
    static fromInline(_: string): Code {
        const c = new Code()
        c.code = "inline:"  + _
        return c
    }
    static fromAsset(_: string): Code {
        const c = new Code()
        c.code = "asset:" + _
        return c
    }
}

export interface FunctionOptions {
    functionName: string
    layers?: ILayerVersion[]
    memorySize?: number
    timeout?: Duration
    environment?: { [key: string]: string },
    logGroup?: LogGroup
}

export interface FunctionProps extends FunctionOptions {
    runtime: Runtime
    code: Code
    handler: string
}

export class Function {
    functionName: string
    constructor(scope: IConstruct, id: string, props: FunctionProps) {
        this.functionName = props.functionName
    }
}

export type RuntimeFamily = object

export type LambdaRuntimeProps = object

export class Runtime {
    static readonly NODEJS_LATEST = new Runtime('nodejs:latest')
    static readonly NODEJS_20_X = new Runtime('nodejs:20:x')

    runtime_data: string
    constructor(name: string, family?: RuntimeFamily | undefined, props?: LambdaRuntimeProps | undefined) {
        this.runtime_data = JSON.stringify({name, family, props})
    }

}