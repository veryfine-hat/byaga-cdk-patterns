export const MockStack = {
    tags: {
        setTag: jest.fn(),
    }
}
export const Stack = jest.fn(() => MockStack)
export const CfnOutput = jest.fn((stack, id, options) => ({ stack, id, ...options }))