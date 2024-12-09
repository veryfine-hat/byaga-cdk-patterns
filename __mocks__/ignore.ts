
export const add = jest.fn();
export const ignores = jest.fn();

const ignore = () => ({ add, ignores });
export default ignore;