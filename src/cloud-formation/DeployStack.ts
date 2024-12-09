import type {Stack} from "aws-cdk-lib/core";

/**
 * Interface for the deploy stack.
 */
export interface DeployStack<T> {
    stack: Stack,
    name: string,
    stage: string,
    project: string,
    config: T
}
