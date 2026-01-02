import { reduceImageFileSize } from '@/lib/reduceImageFileSize'
import { toBase64 } from '@/lib/toBase64'
import { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import { Img } from './Img'

interface GalleryProps {
    onCancel: () => void
    onSave: (img: string) => void
}
export const Gallery = ({ onCancel, onSave }: GalleryProps): JSX.Element => {
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
        <div className="flex flex-col justify-center items-center w-full h-full fixed bottom-0 top-0 right-0 left-0 bg-[#0008]">
            <div className="flex flex-col justify-center items-center w-full h-full">
                {img && (
                    <div className="border flex justify-center items-center w-[max-content]">
                        <Img src={img.compressed} width={250} alt="pré visualização da imagem" />
                    </div>
                )}
                <div className="flex justify-center items-center sm:h-16 mt-8 bg-white p-4 sm:w-auto rounded-md">
                    <StyledDiv>
                        <label htmlFor="file">Escolher arquivo</label>
                        <input
                            name="file"
                            id="file"
                            className="py-4 px-8 rounded-lg font-semibold ml-10"
                            type="file"
                            onChange={handleChange}
                        />
                    </StyledDiv>

                    <button
                        className="py-2 px-4 rounded-lg bg-primary text-xl text-white font-semibold ml-2"
                        onClick={() => onSave(img.compressed)}
                    >
                        Save
                    </button>
                    <button
                        className="py-2 px-4 rounded-lg bg-primary text-xl text-white font-semibold ml-2"
                        onClick={() => {
                            onCancel()
                            setImg({
                                original: '',
                                compressed: ''
                            })
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    )
}

const StyledDiv = styled.div`
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
