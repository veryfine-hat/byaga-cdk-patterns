
export const  StringParameter = {
    fromStringParameterName: jest.fn((stack: never, id: string, name: string) => ({stack, id, name, stringValue: () => 'mock-param'}))
}