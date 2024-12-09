export const genName = jest.fn((id: string) => `name:stack-stage:${id}`);
export const genStackResourceName = jest.fn((id: string) => `resource-name:stack-stage:${id}`);
export const genId = jest.fn((id: string) => `Id:StackStage:${id}`);
export const genStackResourceId = jest.fn((id: string) => `ResourceId:StackStage:${id}`);