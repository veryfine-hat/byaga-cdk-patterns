import * as path from 'path'

export const sourceRoot = path.resolve(process.cwd(), "../src");
export const distributionRoot = path.resolve(process.cwd(), "../dist");

export function getSourceDirectory(type: string, id: string): string {
    return path.join(sourceRoot, type, id)
}
export function getBuildDirectory(type: string, id: string): string {
    return path.join(distributionRoot, type, id)
}