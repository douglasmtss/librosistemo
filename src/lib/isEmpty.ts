export const isEmpty = (obj: Array<unknown> | Record<string, never>): boolean => {
    if (obj.constructor.name === 'Array') {
        return obj.length === 0
    } else {
        return Object.keys(obj).length === 0
    }
}
