'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import styled from 'styled-components'
import { Img } from './Img'
import { reduceImageFileSize } from '@/lib/reduceImageFileSize'

interface ScreenshotDimensions {
    width: number
    height: number
}
interface ChildrenProps {
    getScreenshot: (screenshotDimensions?: ScreenshotDimensions) => string | null
}
interface CameraProps {
    onCancel: () => void
    onSave: (image: string) => void
}
export const Camera = ({ onCancel, onSave }: CameraProps): React.ReactNode => {
    const [image, setImage] = useState({
        origial: '',
        compressed: ''
    })
    const [deviceId, setDeviceId] = useState('')
    const [devices, setDevices] = useState<Device[]>([])
    const webcamRef = useRef<ChildrenProps>(null)

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
            const base64 = String(webcamRef.current.getScreenshot())
            reduceImageFileSize(base64, 50, 100).then(compressed => {
                setImage({
                    origial: base64,
                    compressed
                })
            })
        }
    }, [webcamRef])

    return (
        <Overlay>
            <ContentWrapper>
                {image.origial ? (
                    <div>
                        <Img src={image.origial} alt="foto agora" />
                    </div>
                ) : (
                    <>
                        {deviceId ? (
                            <Webcam
                                ref={webcamRef as React.Ref<Webcam> | undefined}
                                audio={false}
                                videoConstraints={{ deviceId }}
                            />
                        ) : (
                            <DevicesPanel>
                                {devices?.map((device, key) => {
                                    return (
                                        <DeviceButton key={key} onClick={() => setDeviceId(device.deviceId)}>
                                            {device?.label || `Device ${key + 1}`}
                                        </DeviceButton>
                                    )
                                })}
                            </DevicesPanel>
                        )}
                    </>
                )}

                <ActionsRow>
                    <CancelButton onClick={onCancel}>Cancelar</CancelButton>
                    {image.origial ? (
                        <SaveButton onClick={() => onSave(image.compressed)}>Salvar</SaveButton>
                    ) : (
                        <CaptureButton onClick={capture}>Tirar foto</CaptureButton>
                    )}
                </ActionsRow>
            </ContentWrapper>
        </Overlay>
    )
}

const Overlay = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: fixed;
    inset: 0;
    background-color: #0008;
`

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`

const DevicesPanel = styled.div`
    background-color: var(--color-white);
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 16px;
`

const DeviceButton = styled.button`
    padding: 8px 16px;
    border-radius: var(--radius-md);
    background-color: #9ca3af;
    color: var(--color-white);
    margin-bottom: 8px;
`

const ActionsRow = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    margin-top: 32px;
`

const ActionButton = styled.button`
    padding: 16px 32px;
    border-radius: var(--radius-md);
    font-size: 20px;
    line-height: 28px;
    color: var(--color-white);
    font-weight: 600;
`

const CancelButton = styled(ActionButton)`
    background-color: var(--color-primary);
    margin-right: 40px;
`

const SaveButton = styled(ActionButton)`
    background-color: var(--color-success);
    margin-left: 40px;
`

const CaptureButton = styled(ActionButton)`
    background-color: var(--color-primary);
    margin-left: 40px;
`
