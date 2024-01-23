import {createStack, StackArguments} from './create-stack';
import {Construct} from "constructs";
import {Stack} from "aws-cdk-lib";

jest.mock('aws-cdk-lib', () => ({
    Stack: jest.fn().mockImplementation(() => ({})),
}));

let stack: Stack;
let scope: Construct;
let props: StackArguments;

beforeEach(() => {
    jest.clearAllMocks();
    scope = {} as Construct;
    stack = {
        tags: {
            setTag: jest.fn(),
        }
    } as unknown as Stack;
    props = {
        stackName: 'stackName',
        stage: 'stage',
        project: 'project',
        owner: 'owner',
        region: 'region',
    };
    (Stack as unknown as jest.Mock).mockReturnValue(stack)
});

it('creates a new stack with default stage', () => {
    delete props.stage;

    const result = createStack(scope, props);

    expect(Stack).toHaveBeenCalledWith(scope, 'StackNameDevelop', expect.objectContaining({
        stackName: 'stack-name-develop',
    }));
    expect(result).toEqual(expect.objectContaining({
        stack: stack,
        name: props.stackName,
        stage: 'develop',
        project: props.project,
    }));
});

it('creates a new stack with provided stage', () => {
    const result = createStack(scope, props);

    expect(Stack).toHaveBeenCalledWith(scope, 'StackNameStage', expect.objectContaining({
        stackName: 'stack-name-stage',
    }));
    expect(result).toEqual(expect.objectContaining({
        stack: stack,
        name: props.stackName,
        stage: props.stage,
        project: props.project,
    }));
});

it('will add standard tags to the stack', () => {
    createStack(scope, props);

    expect(stack.tags.setTag).toHaveBeenCalledWith('stage', props.stage);
    expect(stack.tags.setTag).toHaveBeenCalledWith('stack', 'stack-name-stage');
    expect(stack.tags.setTag).toHaveBeenCalledWith('project', props.project);
    expect(stack.tags.setTag).toHaveBeenCalledWith('owner', props.owner);
})