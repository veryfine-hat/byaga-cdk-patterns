# Create Stack

The `createStack` function is part of the `@byaga/cdk-patterns` package. It creates a new AWS CDK stack with the provided properties.

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

const app = new App();
const props = {
    stackName: 'MyStack',
    stage: 'prod',
    project: 'MyProject',
    owner: 'MyOwner',
    region: 'us-west-2',
};

const stack = createStack(app, props);
```

In this example, a new stack named 'MyStack' is created with a stage of 'prod', a project of 'MyProject', an owner of 'MyOwner', and a region of 'us-west-2'.