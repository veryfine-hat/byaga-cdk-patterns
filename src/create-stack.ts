import {IConstruct} from "constructs";
import {Stack} from "aws-cdk-lib";
import {genId, genName} from "./generate-identifier";
import {StackProps} from "aws-cdk-lib/core";
import {loadConfiguration, StackConfiguration} from "./load-configuration";

/**
 * Interface for the arguments when creating a stack.
 */
export interface StackArguments extends StackProps {
    stackName: string,
    stage?: string
    project: string
    owner: string
    region: string
}

/**
 * Interface for the stack.
 */
export interface DeployStack<T extends StackConfiguration> {
    stack: Stack,
    name: string,
    stage: string,
    project: string,
    config: Partial<T>
}

/**
 * Creates a new stack.
 * @param {IConstruct} scope - The scope in which to define this construct.
 * @param {StackArguments} props - The arguments for creating the stack.
 * @returns {DeployStack} The created stack.
 */
export function createStack<T extends StackConfiguration>(scope: IConstruct, props: StackArguments): DeployStack<T> {
    const {stage = 'develop'} = props
    const stack = new Stack(scope, genId(props.stackName, stage), {
        ...props,
        stackName: genName(props.stackName, stage)
    });
    stack.tags.setTag('stage', stage);
    stack.tags.setTag('stack', genName(props.stackName, stage));
    stack.tags.setTag('project', props.project);
    stack.tags.setTag('owner', props.owner);

    return setCurrentStack<T>({
        stack,
        name: props.stackName,
        stage,
        project: props.project,
        config: loadConfiguration<T>(stage)
    })
}

let currentStack: DeployStack<StackConfiguration>;

/**
 * Helpful method to get the 'current' stack that is being defined.  Hopefully this will reduce the need to pass the stack around everywhere.
 */
export function getCurrentStack<T extends StackConfiguration>(): DeployStack<T> {
    return currentStack as DeployStack<T>;
}

/**
 * This sets the 'current' stack.  This should be automatic everywhere, but in case something goes wrong here is a way to force the issue
 * @param stack
 */
export function setCurrentStack<T extends StackConfiguration>(stack: DeployStack<T>) {
    currentStack = stack;
    return stack;
}