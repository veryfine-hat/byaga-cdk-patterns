# @byaga/cdk-patterns

This package provides a set of reusable patterns for the AWS Cloud Development Kit (CDK).

NOTE: This package is highly opinionated and is intended to be used by the author. Use at your own risk/joy.

## Installation

To install the package, use the following command:

```bash
npm install @byaga/cdk-patterns
```

## Usage

Import the package in your TypeScript or JavaScript file:

```typescript
import { Pattern } from '@byaga/cdk-patterns';
```

Then, you can use the patterns provided by the package in your CDK stacks.

## Patterns

The package includes the following patterns:

- [createStack](./src/create-stack.md)
- [createNodeJsLambda](./src/create-nodejs-lambda.md)

And the below helpful functions:

- [Building Code](./src/build-code.md)
- [Generating Identifiers](./src/generate-identifier.md)

## Contributing

Contributions are welcome! Please read our contributing guidelines for details.

## License

This project is licensed under the MIT License - see the LICENSE file for details.