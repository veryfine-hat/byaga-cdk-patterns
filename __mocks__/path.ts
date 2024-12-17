export const resolve = jest.fn((...args: string[]) => args.join('/'))
export const relative = jest.fn()
export const join = jest.fn((...args: string[]) => args.join('/'))
export const dirname = jest.fn(path => path.split('/').slice(0, -1).join('/'))