# createStack

This function creates a new AWS CDK stack adding some standard tags and loading the environment configuration from the build .yml files.

## Importing

First, import the `createStack` function into your TypeScript file:

```typescript
import { createStack } from '@byaga/cdk-patterns';
```

## Function

The `createStack` function takes two parameters:

- `scope`: An instance of the `IConstruct` class. This is the scope in which to define this construct.
- `props`: An object of type `StackArguments` that contains the properties for creating the stack.

## StackArguments

The `StackArguments` interface has the following properties:

- `stackName`: A string that represents the name of the stack.
- `stage`: An optional string that represents the stage. If not provided, the default value is 'develop'.
- `project`: A string that represents the project.
- `owner`: A string that represents the owner.
- `region`: A string that represents the region.

## Example

Here's an example of how to use the `createStack` function:

```typescript
import { createStack } from '@byaga/cdk-patterns';
import { App } from 'aws-cdk-lib';

const { stack, config } = createStack(new App(), {
    stackName: 'MyStack',
    stage: 'prod',
    project: 'MyProject',
    owner: 'MyOwner',
    region: 'us-west-2',
});
addThingToStack(config);
```