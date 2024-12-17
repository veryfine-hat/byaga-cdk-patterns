import {createStack, StackArguments} from './create-stack';
import {Construct} from "constructs";
import {Stack} from "aws-cdk-lib/core";
import {loadConfiguration} from "../load-configuration";
import {setCurrentStack} from "./current-stack";
import { MockStack } from "../../__mocks__/aws-cdk-lib/core";

jest.unmock('./create-stack');

let scope: Construct;
let props: StackArguments;

beforeEach(() => {
    jest.clearAllMocks();
    scope = {} as Construct;
    props = {
        stackName: 'stackName',
        stage: 'stage',
        project: 'project',
        owner: 'owner',
        region: 'region'
    };
    (setCurrentStack as jest.Mock).mockImplementation(s => s)
});

it('creates a new stack with default stage', () => {
    delete props.stage;

    const result = createStack(scope, props);

    expect(Stack).toHaveBeenCalledWith(scope, 'Id:StackStage:stackName', expect.objectContaining({
        stackName: 'name:stack-stage:stackName',
    }));
    expect(result).toEqual(expect.objectContaining({
        stack: expect.anything(),
        name: props.stackName,
        stage: 'develop',
        project: props.project,
    }));
});

it('creates a new stack with provided stage', () => {
    const result = createStack(scope, props);

    expect(Stack).toHaveBeenCalledWith(scope, 'Id:StackStage:stackName', expect.objectContaining({
        stackName: 'name:stack-stage:stackName',
    }));
    expect(result).toEqual(expect.objectContaining({
        stack: expect.anything(),
        name: props.stackName,
        stage: props.stage,
        project: props.project,
    }));
});

it('will add standard tags to the stack', () => {
    (Stack as never as jest.Mock).mockImplementation(() => MockStack);
    createStack(scope, props);

    expect(MockStack.tags.setTag).toHaveBeenCalledWith('stage', props.stage);
    expect(MockStack.tags.setTag).toHaveBeenCalledWith('stack', 'name:stack-stage:stackName');
    expect(MockStack.tags.setTag).toHaveBeenCalledWith('project', props.project);
    expect(MockStack.tags.setTag).toHaveBeenCalledWith('owner', props.owner);
})

it('will load the configuration for the stage', () => {
    createStack(scope, props);

    expect(loadConfiguration).toHaveBeenCalledWith(props.stage);
})