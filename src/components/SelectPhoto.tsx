'use client'
import { useState } from 'react'
import styled from 'styled-components'
import { Camera } from './Camera'
import { Gallery } from './Gallery'

interface SelectPhotoProps {
    onCancel: () => void
    onSave: (img: string) => void
}
export const SelectPhoto = ({ onCancel, onSave }: SelectPhotoProps): React.ReactNode => {
    const [isFromCamera, setISFromCamera] = useState<boolean>(false)
    const [isFromGallery, setISFromGallery] = useState<boolean>(false)

    if (isFromCamera) {
        return <Camera onCancel={onCancel} onSave={onSave} />
    }

    if (isFromGallery) {
        return <Gallery onCancel={onCancel} onSave={onSave} />
    }

    return (
        <Overlay>
            <ContentWrapper>
                <ActionsRow>
                    <CancelButton onClick={onCancel}>Cancelar</CancelButton>
                    <PrimaryButton onClick={() => setISFromGallery(true)}>Galeria</PrimaryButton>

                    <PrimaryButton onClick={() => setISFromCamera(true)}>Camera</PrimaryButton>
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

const ActionsRow = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    margin-top: 32px;
`

const ChoiceButton = styled.button`
    padding: 8px 16px;
    border-radius: var(--radius-md);
    font-size: 20px;
    line-height: 28px;
    font-weight: 600;
    margin-left: 8px;
`

const CancelButton = styled(ChoiceButton)`
    background-color: var(--color-gray-200);
    color: #4b5563;
`

const PrimaryButton = styled(ChoiceButton)`
    background-color: var(--color-primary);
    color: var(--color-white);
`
