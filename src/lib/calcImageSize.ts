/* eslint-disable camelcase */
export function calcImageSize(image: string): number {
    let y = 1
    if (image.endsWith('==')) {
        y = 2
    }
    const x_size = image.length * (3 / 4) - y

    return Math.round(x_size / 1024)
}
