import {Function as Lambda, FunctionProps} from "aws-cdk-lib/aws-lambda";
import {CfnOutput, Duration} from "aws-cdk-lib";
import {applyHoneycombToLambda} from "../lambda-layer/apply-honeycomb-to-lambda";
import {LogRetention, RetentionDays} from "aws-cdk-lib/aws-logs";
import {RemovalPolicy} from "aws-cdk-lib/core";
import {genStackResourceId, genStackResourceName} from "../generate-identifier";
import {getCurrentStack} from "../create-stack";

/**
 * Interface for the properties of the FunctionIntegration class.
 */
export interface FunctionIntegrationProps {
    funcProps?: FunctionProps,
    timeout?: Duration
    memory?: number
}

export interface FunctionIntegration {
    id: string,
    function: Lambda
}

/**
 * Initializes a new function
 * @param {string} id - The ID of the function.
 * @param {FunctionIntegrationProps} options - The properties of the function.
 */
export function createFunction(id: string, options: FunctionIntegrationProps) {
    const props = applyHoneycombToLambda({
        functionName: genStackResourceName(id),
        memorySize: options.memory || 256,
        timeout: options.timeout || Duration.seconds(30),
        ...(options.funcProps || {}) as FunctionProps
    })

    const {stack} = getCurrentStack()
    const details: FunctionIntegration = {
        id,
        function: new Lambda(stack, genStackResourceId(id, 'lambda'), props)
    }

    new CfnOutput(stack, genStackResourceId(id, 'function-name'), {
        value: details.function.functionName,
        exportName: genStackResourceName(id, 'function-name')
    });

    new LogRetention(stack, genStackResourceId(id, 'log-retention'), {
        logGroupName: details.function.logGroup.logGroupName,
        retention: RetentionDays.ONE_WEEK,
        removalPolicy: RemovalPolicy.DESTROY,
    });

    return details
}