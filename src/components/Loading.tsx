import { AiOutlineLoading3Quarters } from 'react-icons/ai'

export const Loading = (): React.ReactNode => {
    return (
        <div className="p-8">
            <div className="min-w-62.5 min-h-62.5 w-full h-full flex  flex-col justify-center items-center rounded-lg border-4 border-gray-200">
                <AiOutlineLoading3Quarters className="animate-spin text-primary duration-100 text-9xl opacity-60" />
            </div>
        </div>
    )
}
