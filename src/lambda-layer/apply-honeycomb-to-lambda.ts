import type {FunctionProps} from "aws-cdk-lib/aws-lambda"
import {stringValue} from "../ssm";
import {getCurrentStack} from "../cloud-formation";
import {getLayer} from "./get-layer";

export function applyHoneycombToLambda(props: FunctionProps): FunctionProps {
    const {stack} = getCurrentStack()
    const honeyCombLayer = getLayer('hc-layer', `arn:aws:lambda:${stack.region}:702835727665:layer:honeycomb-lambda-extension-x86_64-v11-1-1:1`)

    const layers = props.layers ? [...props.layers] : []
    const environment = {...props.environment}
    const options = {
        parameterGroup: getCurrentStack().project
    }

    layers.push(honeyCombLayer)
    environment.LIBHONEY_API_KEY = stringValue(`/honeycomb/api-key`, options)
    environment.LIBHONEY_DATASET = stringValue(`/honeycomb/dataset`, options)
    environment.LOGS_API_DISABLE_PLATFORM_MSGS = "true"

    return {
        ...props,
        layers,
        environment
    }
}