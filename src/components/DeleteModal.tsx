interface DeleteModalProps {
    onCancel: () => void
    onConfirm: () => void
}
export const DeleteModal = (props: DeleteModalProps): JSX.Element => {
    const { onCancel, onConfirm } = props

    return (
        <div className="z-10 fixed w-screen h-screen top-0 bottom-0 left-0 right-0 bg-[#0009] flex justify-center items-center">
            <div className="relative w-[90%] max-w-[500px] flex overflow-y-auto">
                <button className="px-2 py-4 rounded-md text-white bg-primary flex-1" onClick={onCancel}>
                    Cancelar
                </button>

                <button className="px-2 py-4 rounded-md text-white bg-red-500 flex-1 ml-8" onClick={onConfirm}>
                    Confirmar
                </button>
            </div>
        </div>
    )
}
