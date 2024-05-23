import {FunctionProps, ILayerVersion, LayerVersion} from "aws-cdk-lib/aws-lambda"
import {DeployStack} from "../DeployStack";
import {SsmParameter, SsmParameterOptions} from "../SsmParameter";

let honeyCombLayer: ILayerVersion
export function applyHoneycombToLambda(stack: DeployStack, props: FunctionProps): FunctionProps {
    if (!honeyCombLayer) honeyCombLayer = LayerVersion.fromLayerVersionArn(stack, stack.genId('hc-layer'), `arn:aws:lambda:${stack.region}:702835727665:layer:honeycomb-lambda-extension-x86_64-v11-1-1:1`)

    const layers = props.layers ? [...props.layers] : []
    const environment = {...props.environment}
    const options: SsmParameterOptions = { parameterGroup: stack.project  }

    layers.push(honeyCombLayer)
    environment.LIBHONEY_API_KEY = new SsmParameter(stack, `/honeycomb/api-key`, options).stringValue
    environment.LIBHONEY_DATASET = new SsmParameter(stack, `/honeycomb/dataset`, options).stringValue
    environment.LOGS_API_DISABLE_PLATFORM_MSGS = "true"

    return {
        ...props,
        layers,
        environment
    }
}