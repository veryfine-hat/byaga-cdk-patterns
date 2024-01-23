# createNodeJsLambda

The `createNodeJsLambda` function is part of the `@byaga/cdk-patterns` package. It will instantiate a new AWS Lambda function with the latest Node.js runtime. 

In Order to use this pattern you will need to have your project in a predicable structure
## Directory Structure

When using the `createNodeJsLambda` function, your project should follow this directory structure:

```plaintext.
.
├── src
│   ├── index.ts          # Main application entry point
│   └── lambda            # Lambda functions directory
│       ├── my-function    # Directory name matching the id of the lambda
│       │   ├── .cdkignore  # File which will tells the logic which files should be excluded
│       │   ├── my-function.ts  # Root file name, should export a function 'handler'
│       │   ├── my-function.spec.ts  # Test File for 'my-function' TypeScript Lambda function
│       │   ├── tsconfig.json  # TypeScript configuration for 'my-function' TypeScript Lambda function
│       │   └── package.json  # 'myFunction' TypeScript Lambda function dependencies
│       └── my-js-function    # Directory for 'myJsFunction' JavaScript Lambda function
│           ├── .cdkignore  # File which will tells the logic which files should be excluded
│           ├── my-js-function.js  # 'my-js-function' JavaScript Lambda function code
│           ├── my-js-function.spec.js  # Test File for 'my-js-function' JavaScript Lambda function
│           └── package.json  # 'myJsFunction' JavaScript Lambda function dependencies
└── deploy                 # Deploy directory
    └── lib                # Directory containing your stack and its resources
```


## Importing

First, import the `createNodeJsLambda` function into your TypeScript file:

```typescript
import { createNodeJsLambda } from '@byaga/cdk-patterns';
```

## Constructor

The `createNodeJsLambda` function constructor takes three parameters:

- `stack`: An instance of the `DeployStack` function.
- `id`: A string that represents the ID of the function.
- `options`: An optional object of type `NodeFunctionProps` that contains the properties of the function.
- `timeout`: An optional instance of the `Duration` function from the `aws-cdk-lib` package. It represents the timeout duration for the function.
- `memory`: An optional number that represents the memory size for the function.

## Example

Here's an example of how to use the `createNodeJsLambda` function:

```typescript
import { DeployStack } from './DeployStack';
import { createNodeJsLambda } from '@byaga/cdk-patterns';
import { FunctionProps, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Duration } from 'aws-cdk-lib';

interface YourStackProps extends StackArguments {
    config: StackConfig
}
interface StackConfig {
    memorySize: number;
    timeout: Duration;
}

export function createYourStack(props: YourStackProps): void {
    createStack(props);

    // Create the Lambda function
    createNodeJsLambda('my-function', { 
        funcProps: props.config
    });
}
```

In this example, a new `createNodeJsLambda` function named `my-function` is created with a runtime of Node.js 20.x, a memory size of 256 MB, and a timeout of 30 seconds.
```
new createNodeJsLambda(stack, id, options);
```