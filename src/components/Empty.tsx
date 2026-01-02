import { FaRegFolderOpen } from 'react-icons/fa'

export const Empty = (): JSX.Element => {
    return (
        <div className="p-8">
            <div className="min-w-[250px] min-h-[250px] w-full h-full flex  flex-col justify-center items-center rounded-lg border-4 border-gray-200">
                <FaRegFolderOpen className="text-gray-300 text-9xl" />
                <span className="text-gray-400 text-xl">Nenhum dado foi econtrado</span>
            </div>
        </div>
    )
}
