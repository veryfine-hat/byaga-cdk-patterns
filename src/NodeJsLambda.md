# NodeJsLambda

The `NodeJsLambda` class is part of the `@byaga/cdk-patterns` package. It will instantiate a new AWS Lambda function with the latest Node.js runtime. 

In Order to use this pattern you will need to have your project in a predicable structure
## Directory Structure

When using the `NodeJsLambda` class, your project should follow this directory structure:

```plaintext.
.
├── src
│   ├── index.ts          # Main application entry point
│   └── lambda            # Lambda functions directory
│       ├── my-function    # Directory for 'myFunction' TypeScript Lambda function
│       │   ├── .cdkignore  # File which will tells the logic which files should be excluded
│       │   ├── my-function.ts  # 'my-function' TypeScript Lambda function code
│       │   ├── my-function.spec.ts  # Test File for 'my-function' TypeScript Lambda function
│       │   ├── tsconfig.json  # TypeScript configuration for 'my-function' TypeScript Lambda function
│       │   └── package.json  # 'myFunction' TypeScript Lambda function dependencies
│       └── my-js-function    # Directory for 'myJsFunction' JavaScript Lambda function
│           ├── .cdkignore  # File which will tells the logic which files should be excluded
│           ├── my-js-function.js  # 'my-js-function' JavaScript Lambda function code
│           ├── my-js-function.spec.js  # Test File for 'my-js-function' JavaScript Lambda function
│           └── package.json  # 'myJsFunction' JavaScript Lambda function dependencies
└── deploy                 # Deploy directory
    └── lib                # Library directory
        ├── MyFunction.ts  # 'MyFunction' TypeScript file
        └── MyJsFunction.ts  # 'MyJsFunction' TypeScript file
```


## Importing

First, import the `NodeJsLambda` class into your TypeScript file:

```typescript
import { NodeJsLambda } from '@byaga/cdk-patterns';
```

## Constructor

The `NodeJsLambda` class constructor takes three parameters:

- `stack`: An instance of the `DeployStack` class.
- `id`: A string that represents the ID of the function.
- `options`: An optional object of type `NodeFunctionProps` that contains the properties of the function.
- `timeout`: An optional instance of the `Duration` class from the `aws-cdk-lib` package. It represents the timeout duration for the function.
- `memory`: An optional number that represents the memory size for the function.

## Example

Here's an example of how to use the `NodeJsLambda` class:

```typescript
import { NodeJsLambda } from '@byaga/cdk-patterns';
import { DeployStack } from './DeployStack';
import { FunctionProps, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Duration } from 'aws-cdk-lib';

const stack = new DeployStack();
const id = 'my-function';
const options = {
    funcProps: {
        runtime: Runtime.NODEJS_20_X,
        memorySize: 256,
        timeout: Duration.seconds(30),
    }
};

const myFunction = new NodeJsLambda(stack, id, options);
```

In this example, a new `NodeJsLambda` function named `my-function` is created with a runtime of Node.js 20.x, a memory size of 256 MB, and a timeout of 30 seconds.
```
new NodeJsLambda(stack, id, options);
```