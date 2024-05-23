import {Code, FunctionOptions, Runtime} from "aws-cdk-lib/aws-lambda"
import {DeployStack} from "./DeployStack";
import {FunctionIntegration} from "./FunctionIntegration";
import {buildNodeSource} from "./methods/build-node-source";
import {Duration} from "aws-cdk-lib";
import duration from "./methods/duration";

/**
 * Interface for the properties of a Node.js function.
 */
interface NodeFunctionProps {
    /**
     * The properties of the function.
     */
    funcProps?: FunctionOptions
    /**
     * The timeout duration for the function.
     */
    timeout?: Duration
    /**
     * The memory size for the function.
     */
    memory?: number,
}

/**
 * Class representing a Node.js Lambda function.
 * @extends FunctionIntegration
 */
export class NodeJsLambda extends FunctionIntegration {
    /**
     * Creates a new Node.js Lambda function.
     * @param {DeployStack} stack - The deployment stack.
     * @param {string} id - The ID of the function.
     * @param {NodeFunctionProps} options - The properties of the function.
     */
    constructor(stack: DeployStack, id: string, options?: NodeFunctionProps) {
        console.log('Defining Node Lambda', id)
        // Measure the duration of the build process
        const done = duration()
        // Build the Node.js source code
        const buildDir = buildNodeSource('lambda', id)
        console.log('Total Build Duration (ms)', done())

        // Call the parent constructor with the function properties
        super(stack, id, {
            ...options,
            funcProps: {
                ...options?.funcProps,
                // The source code of the function
                code: Code.fromAsset(buildDir),
                // The handler of the function
                handler: `${id}.handler`,
                // The runtime of the function
                runtime: Runtime.NODEJS_20_X
            }
        })
    }
}