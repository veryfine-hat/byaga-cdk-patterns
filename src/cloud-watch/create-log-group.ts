import {LogGroup, RetentionDays} from "aws-cdk-lib/aws-logs";
import {genStackResourceId} from "../generate-identifier";
import {getCurrentStack} from "../create-stack";

/**
 * Interface for the properties of the FunctionIntegration class.
 */
export interface LogGroupProps {
    category?: string,
    retention?: RetentionDays
}

/**
 * Initializes a new function
 * @param id - The name of the resource sending logs to this log group
 * @param type - The type of resource sending logs to this log group.
 * @param options - The properties of the function.
 */
export function createLogGroup(id: string, type: string, options?: LogGroupProps) {
    const category = options?.category ?? 'aws'
    const {stack} = getCurrentStack()
    const logGroupName = `/${category}/${type}/${id}`;
    return new LogGroup(stack, genStackResourceId(id, 'log-group'), {
        logGroupName,
        retention: options?.retention ?? RetentionDays.ONE_WEEK
    })
}