# Build Node Source

The `buildNodeSource` function is part of the `@byaga/cdk-patterns` package. It builds the source code for a Node.js project.

## Importing

First, import the `buildNodeSource` function into your TypeScript file:

```typescript
import { buildNodeSource } from '@byaga/cdk-patterns';
```

## Function

The `buildNodeSource` function takes three parameters:

- `type`: A string that represents the type of the source code.
- `id`: A string that represents the ID of the source code.
- `options`: An optional object of type `BuildOptions` that contains options for building the source code.

## BuildOptions

The `BuildOptions` interface has the following properties:

- `subdirectory`: An optional string that represents a subdirectory.

## Example

Here's an example of how to use the `buildNodeSource` function:

```typescript
import { buildNodeSource } from '@byaga/cdk-patterns';

const type = 'type';
const id = 'id';
const options = {
    subdirectory: 'subdir',
};

const buildDir = buildNodeSource(type, id, options);
```

In this example, the `buildNodeSource` function builds the source code for a Node.js project of type 'type' and ID 'id', with a subdirectory of 'subdir'. The function returns the build directory containing the resulting source code.