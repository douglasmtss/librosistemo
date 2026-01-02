import { useState } from 'react'
import { Camera } from './Camera'
import { Gallery } from './Gallery'

interface SelectPhotoProps {
    onCancel: () => void
    onSave: (img: string) => void
}
export const SelectPhoto = ({ onCancel, onSave }: SelectPhotoProps): JSX.Element => {
    const [isFromCamera, setISFromCamera] = useState<boolean>(false)
    const [isFromGallery, setISFromGallery] = useState<boolean>(false)

    if (isFromCamera) {
        return <Camera onCancel={onCancel} onSave={onSave} />
    }

    if (isFromGallery) {
        return <Gallery onCancel={onCancel} onSave={onSave} />
    }

    return (
        <div className="flex flex-col justify-center items-center w-full h-full fixed bottom-0 top-0 right-0 left-0 bg-[#0008]">
            <div className="flex flex-col justify-center items-center w-full h-full">
                <div className="flex justify-center items-center h-12 mt-8">
                    <button
                        className="py-2 px-4 rounded-lg bg-gray-200 text-xl text-gray-600 font-semibold ml-2"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                    <button
                        className="py-2 px-4 rounded-lg bg-primary text-xl text-white font-semibold ml-2"
                        onClick={() => setISFromGallery(true)}
                    >
                        Galeria
                    </button>

                    <button
                        className="py-2 px-4 rounded-lg bg-primary text-xl text-white font-semibold ml-2"
                        onClick={() => setISFromCamera(true)}
                    >
                        Camera
                    </button>
                </div>
            </div>
        </div>
    )
}
