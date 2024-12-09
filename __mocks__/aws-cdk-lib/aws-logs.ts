export const LogRetention = jest.fn()
export const RetentionDays = new Proxy({}, {
    get: (target: Record<string, never>, property: string) => {
        if (property in target) {
            return target[property as string];
        } else {
            return property.toLowerCase().replaceAll('_', ':');
        }
    }
});