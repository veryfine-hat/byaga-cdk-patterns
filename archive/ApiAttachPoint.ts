import {  Method } from "aws-cdk-lib/aws-apigateway";

/**
 * Interface for the API attach point.
 */
export interface ApiAttachPoint {
    method: Method
    resourceArn: string
}