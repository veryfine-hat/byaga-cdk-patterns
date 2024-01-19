export interface ICorsConfig {
    maxAge?: number
    exposeHeaders?: string[],
    allowOrigin?: string|string[]
}