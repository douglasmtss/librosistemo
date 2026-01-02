import { useCallback, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { Img } from './Img'
import { reduceImageFileSize } from '@/lib/reduceImageFileSize'

interface CameraProps {
    onCancel: () => void
    onSave: (image: string) => void
}
export const Camera = ({ onCancel, onSave }: CameraProps): JSX.Element => {
    const [image, setImage] = useState({
        origial: '',
        compressed: ''
    })
    const [deviceId, setDeviceId] = useState('')
    const [devices, setDevices] = useState<Device[]>([])
    const webcamRef = useRef(null)

    const handleDevices = useCallback(
        (mediaDevices: Device[]) => {
            setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput'))
        },
        [setDevices]
    )

    useEffect(() => {
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                // Após obter permissão, paramos o stream para não bloquear a câmera
                stream.getTracks().forEach(track => track.stop())
            })

            navigator.mediaDevices.enumerateDevices().then(handleDevices)
        }
    }, [handleDevices])

    const capture = useCallback(() => {
        if (webcamRef.current) {
            // @ts-ignore
            const base64 = webcamRef.current.getScreenshot()
            reduceImageFileSize(base64, 50, 100).then(compressed => {
                setImage({
                    origial: base64,
                    compressed
                })
            })
        }
    }, [webcamRef])

    return (
        <div className="flex flex-col justify-center items-center w-full h-full fixed bottom-0 top-0 right-0 left-0 bg-[#0008]">
            <div className="flex flex-col justify-center items-center w-full h-full">
                {image.origial ? (
                    <div>
                        <Img src={image.origial} alt="foto agora" />
                    </div>
                ) : (
                    <>
                        {deviceId ? (
                            <Webcam ref={webcamRef} audio={false} videoConstraints={{ deviceId }} />
                        ) : (
                            <div className="bg-white w-full flex flex-col p-4">
                                {devices?.map((device, key) => {
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setDeviceId(device.deviceId)}
                                            className="py-2 px-4 rounded-md bg-gray-400 text-white mb-2"
                                        >
                                            {device?.label || `Device ${key + 1}`}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}

                <div className="flex justify-center items-center h-12 mt-8">
                    <button
                        className="py-4 px-8 rounded-lg bg-primary text-xl text-white font-semibold mr-10"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                    {image.origial ? (
                        <button
                            className="py-4 px-8 rounded-lg bg-green-500 text-xl text-white font-semibold ml-10"
                            onClick={() => onSave(image.compressed)}
                        >
                            Salvar
                        </button>
                    ) : (
                        <button
                            className="py-4 px-8 rounded-lg bg-primary text-xl text-white font-semibold ml-10"
                            onClick={capture}
                        >
                            Tirar foto
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
