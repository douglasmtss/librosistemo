/* eslint-disable camelcase */
// Credit: https://github.com/Gimyk/resize_base64_image/blob/main/main.js

/**
 * Resize a base 64 Image
 * @param {String} base64Str - The base64 string (must include MIME type)
 * @param {Number} MAX_WIDTH - The width of the image in pixels
 * @param {Number} MAX_HEIGHT - The height of the image in pixels
 */
export async function reduceImageFileSize(base64Str: string, MAX_WIDTH = 450, MAX_HEIGHT = 450): Promise<string> {
    const resized_base64 = await new Promise(resolve => {
        const img = new Image()
        img.src = base64Str
        img.onload = () => {
            const canvas = document.createElement('canvas')
            let width = img.width
            let height = img.height

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width
                    width = MAX_WIDTH
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height
                    height = MAX_HEIGHT
                }
            }
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            ctx!.drawImage(img, 0, 0, width, height)
            canvas.toBlob(
                blob => {
                    const fr = new FileReader()
                    fr.readAsDataURL(blob as Blob)

                    fr.addEventListener('load', () => {
                        const dataUrl = fr.result
                        resolve(dataUrl)
                    })
                },
                'image/webp',
                0.5
            )
            // resolve(canvas.toDataURL()) // this will return base64 image results after resize
        }
    })

    return resized_base64 as string
}
