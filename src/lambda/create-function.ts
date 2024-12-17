import {Duration} from "aws-cdk-lib/core";
import {Function as Lambda, FunctionProps, Runtime} from "aws-cdk-lib/aws-lambda";
import {LogGroup, RetentionDays} from "aws-cdk-lib/aws-logs";
import {applyHoneycombToLambda} from "../lambda-layer";
import {genId, genStackResourceId, genStackResourceName, getCurrentStack, output} from "../cloud-formation";
import {createLogGroup} from "../cloud-watch";
import {setLogRetention} from "../cloud-watch/set-log-retention";

type FunctionPropsWithDefaults = Partial<FunctionProps> & Pick<FunctionProps, 'code' | 'handler'>
/**
 * Interface for the properties of the FunctionIntegration class.
 */
export interface FunctionIntegrationProps {
    funcProps?: FunctionPropsWithDefaults,
    timeout?: Duration
    memory?: number
}

export interface FunctionIntegration {
    id: string,
    logGroup: LogGroup
    lambda: Lambda
}

/**
 * Initializes a new function
 * @param {string} id - The ID of the function.
 * @param {FunctionIntegrationProps} options - The properties of the function.
 */
export function createFunction(id: string, options: FunctionIntegrationProps) {
    const props: FunctionProps = applyHoneycombToLambda({
        functionName: genStackResourceName(id),
        memorySize: options.memory || 256,
        timeout: options.timeout || Duration.seconds(30),
        runtime: Runtime.NODEJS_LATEST,
        ...(options.funcProps || {}) as FunctionPropsWithDefaults
    })

    const {stack} = getCurrentStack()
    const logGroup = createLogGroup(id, 'lambda');
    setLogRetention(logGroup, RetentionDays.ONE_WEEK);

    const details: FunctionIntegration = {
        id,
        logGroup,
        lambda: new Lambda(stack, genStackResourceId(id, 'lambda'), {
            ...props,
            logGroup
        })
    }

    output(genId(id, 'function-name'), details.lambda.functionName)


    return details
}