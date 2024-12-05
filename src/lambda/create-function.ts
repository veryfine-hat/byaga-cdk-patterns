import {CfnOutput, Duration, RemovalPolicy} from "aws-cdk-lib";
import {Function as Lambda, FunctionProps, Runtime} from "aws-cdk-lib/aws-lambda";
import {LogGroup, LogRetention, RetentionDays} from "aws-cdk-lib/aws-logs";
import {applyHoneycombToLambda} from "../lambda-layer";
import {genStackResourceId, genStackResourceName, getCurrentStack} from "../cloud-formation";
import {createLogGroup} from "../cloud-watch";

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
    const details: FunctionIntegration = {
        id,
        logGroup,
        lambda: new Lambda(stack, genStackResourceId(id, 'lambda'), {
            ...props,
            logGroup
        })
    }

    new CfnOutput(stack, genStackResourceId(id, 'function-name'), {
        value: details.lambda.functionName,
        exportName: genStackResourceName(id, 'function-name')
    });

    new LogRetention(stack, genStackResourceId(id, 'log-retention'), {
        logGroupName: logGroup.logGroupName,
        retention: RetentionDays.ONE_WEEK,
        removalPolicy: RemovalPolicy.DESTROY
    });

    return details
}