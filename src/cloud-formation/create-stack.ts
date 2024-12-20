import type {IConstruct} from "constructs";
import type {DeployStack} from "./DeployStack";
import {type StackProps, Stack} from "aws-cdk-lib/core";
import {genId, genName} from "./generate-identifier";
import {loadConfiguration} from "../load-configuration";
import {setCurrentStack} from "./current-stack";

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
 * Creates a new stack.
 * @param scope - The scope in which to define this construct.
 * @param props - The arguments for creating the stack.
 * @returns The created stack.
 */
export function createStack<Config extends StackArguments>(scope: IConstruct, props: StackArguments): DeployStack<Config> {
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
        config: loadConfiguration<Config>(stage)
    })
}