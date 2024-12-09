export * from './generate-identifier'
export const getCurrentStack = jest.fn(() => ({ stack: {id: 'my-stack'} }));
export const output = jest.fn();