import {genId, genName, genStackResourceId, genStackResourceName} from './generate-identifier';
import {getCurrentStack} from "./create-stack";

jest.mock("./create-stack")

describe('genName', () => {
    it('generates a name by joining provided strings with a hyphen', () => {
        const result = genName('My', 'Test', 'Name');
        expect(result).toBe('my-test-name');
    });

    it('ignores empty strings', () => {
        const result = genName('My', '', 'Name');
        expect(result).toBe('my-name');
    });

    it('can split camel case names', () => {
        const result = genName('MyTestName');
        expect(result).toBe('my-test-name');
    })

    it('will convert underscores to hyphens', () => {
        const result = genName('my_test_name');
        expect(result).toBe('my-test-name');
    })
});

describe('genId', () => {
    it('generates an ID by joining provided strings with a hyphen', () => {
        const result = genId('my', 'test', 'id');
        expect(result).toBe('MyTestId');
    });

    it('ignores empty strings', () => {
        const result = genId('my', '', 'id');
        expect(result).toBe('MyId');
    });

    it('will preserve camel case names', () => {
        const result = genId('myTestName');
        expect(result).toBe('MyTestName');
    })

    it('will join hyphenated names', () => {
        const result = genId('my-test-name');
        expect(result).toBe('MyTestName');

    })
});

describe('genStackResourceName', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getCurrentStack as jest.Mock).mockReturnValue({
                name: 'MyStack',
            stage: 'develop'
        });
    })
    it('generates a resource name for a stack', () => {
        const result = genStackResourceName('MyResource');
        expect(result).toBe('my-stack-my-resource-develop');
    });
});

describe('genStackResourceId', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getCurrentStack as jest.Mock).mockReturnValue({
            stage: 'develop',
            name: 'MyStack'
        });
    })

    it('generates a resource ID for a stack', () => {
        const result = genStackResourceId('myResource');
        expect(result).toBe('MyStackMyResourceDevelop');
    });
});