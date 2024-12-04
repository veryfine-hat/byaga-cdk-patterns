import {IConstruct} from "constructs";
import {Stack} from "aws-cdk-lib";
import {genId, genName} from "./generate-identifier";
import {StackProps} from "aws-cdk-lib/core";
import {loadConfiguration, StackConfiguration} from "../load-configuration";

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
 * Interface for the deploy stack.
 */
export interface DeployStack {
    stack: Stack,
    name: string,
    stage: string,
    project: string,
    config: StackConfiguration
}

/**
 * Creates a new stack.
 * @param {IConstruct} scope - The scope in which to define this construct.
 * @param {StackArguments} props - The arguments for creating the stack.
 * @returns {DeployStack} The created stack.
 */
export function createStack(scope: IConstruct, props: StackArguments): DeployStack {
    const {stage = 'develop'} = props
    const stack = new Stack(scope, genId(props.stackName, stage), {
        ...props,
        stackName: genName(props.stackName, stage)
    });
    stack.tags.setTag('stage', stage);
    stack.tags.setTag('stack', genName(props.stackName, stage));
    stack.tags.setTag('project', props.project);
    stack.tags.setTag('owner', props.owner);

    return setCurrentStack({
        stack,
        name: props.stackName,
        stage,
        project: props.project,
        config: loadConfiguration(stage)
    })
}

let currentStack: DeployStack;

/**
 * Helpful method to get the 'current' stack that is being defined.  Hopefully this will reduce the need to pass the stack around everywhere.
 */
export function getCurrentStack() {
    return currentStack;
}

/**
 * This sets the 'current' stack.  This should be automatic everywhere, but in case something goes wrong here is a way to force the issue
 * @param stack
 */
export function setCurrentStack(stack: DeployStack) {
    currentStack = stack;
    return stack;
}