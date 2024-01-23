# Generate Identifier

The `generate-identifier.ts` file contains utility functions for generating consistent names and IDs across an application.

## genName

The `genName` function generates a name in a kebob-case. Each string is converted to lowercase and any uppercase letters are replaced with a hyphen followed by the lowercase letter.

```typescript
import { genName } from './generate-identifier';

const name = genName('My', 'TestResource', 'Name');
console.log(name); // Outputs: 'my-test-resource-name'
```

## genId

The `genId` function generates an ID in a ProperCase format. The first letter of the ID is capitalized and any hyphen followed by a letter is replaced with the uppercase letter.

```typescript
import { genId } from './generate-identifier';

const id = genId('my', 'test-resource', 'id');
console.log(id); // Outputs: 'MyTestResourceId'
```

## genStackResourceName

The `genStackResourceName` function generates a resource name for a resource within a stack by joining the stack name, resource, and stage with a hyphen.

```typescript
import { genStackResourceName } from './generate-identifier';

const resourceName = genStackResourceName('MyStack', 'MyResource');
console.log(resourceName); // Outputs: 'my-stack-my-resource-develop'
```

## genStackResourceId

The `genStackResourceId` function generates a resource ID for a resource within a stack by joining the stack name, stage, and resource. The first letter of the ID is capitalized and any hyphen followed by a letter is replaced with the uppercase letter.

```typescript
import { genStackResourceId } from './generate-identifier';

const resourceId = genStackResourceId('myStack', 'myResource');
console.log(resourceId); // Outputs: 'MyStackDevelopMyResource'
```
```