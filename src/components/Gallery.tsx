'use client'
import { reduceImageFileSize } from '@/lib/reduceImageFileSize'
import { toBase64 } from '@/lib/toBase64'
import { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import { Img } from './Img'

interface GalleryProps {
    onCancel: () => void
    onSave: (img: string) => void
}
export const Gallery = ({ onCancel, onSave }: GalleryProps): React.ReactNode => {
    const [img, setImg] = useState({
        original: '',
        compressed: ''
    })

    const handleChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
        if (!e.target.files?.length) {
            return
        }
        const file = e.target.files[0]
        const imageBase64 = (await toBase64(file)) as string

        await reduceImageFileSize(imageBase64, 50, 100).then(compressed => {
            setImg({
                original: imageBase64,
                compressed
            })
        })
    }

    return (
        <Overlay>
            <ContentWrapper>
                {img && (
                    <PreviewWrapper>
                        <Img src={img.compressed} width={250} alt="pré visualização da imagem" />
                    </PreviewWrapper>
                )}
                <ControlsBar>
                    <FilePickerWrapper>
                        <label htmlFor="file">Escolher arquivo</label>
                        <FileInput name="file" id="file" type="file" onChange={handleChange} />
                    </FilePickerWrapper>

                    <ActionButton onClick={() => onSave(img.compressed)}>Save</ActionButton>
                    <ActionButton
                        onClick={() => {
                            onCancel()
                            setImg({
                                original: '',
                                compressed: ''
                            })
                        }}
                    >
                        Cancelar
                    </ActionButton>
                </ControlsBar>
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

const PreviewWrapper = styled.div`
    border: 1px solid var(--color-gray-200);
    display: flex;
    justify-content: center;
    align-items: center;
    width: max-content;
`

const ControlsBar = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 32px;
    background-color: var(--color-white);
    padding: 16px;
    border-radius: var(--radius-md);

    @media (min-width: 640px) {
        height: 64px;
        width: auto;
    }
`

const FileInput = styled.input`
    padding: 16px 32px;
    border-radius: var(--radius-md);
    font-weight: 600;
    margin-left: 40px;
`

const ActionButton = styled.button`
    padding: 8px 16px;
    border-radius: var(--radius-md);
    background-color: var(--color-primary);
    font-size: 20px;
    line-height: 28px;
    color: var(--color-white);
    font-weight: 600;
    margin-left: 8px;
`

const FilePickerWrapper = styled.div`
    input[type='file'] {
        display: none;
    }

    label {
        padding: 0.5rem;
        background-color: #333;
        color: #fff;
        display: block;
        text-align: center;
        cursor: pointer;
        transition: 0.5s;
        border: 1px solid #333;
        border-radius: 8px;
    }

    label:hover {
        color: #333;
        background-color: #fff;
    }
`
