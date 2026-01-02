import { IoMdClose } from 'react-icons/io'
import { Img } from './Img'
import { BookStatus } from './BookStatus'

export const BookModal = (props: { book: Book | Record<string, never>; onClose: () => void }): JSX.Element => {
    const { book, onClose } = props

    return (
        <div className="z-10 fixed w-screen h-screen top-0 bottom-0 left-0 right-0 bg-[#0009] flex justify-center items-center">
            <div className="relative bg-white w-[90%] max-w-[500px] h-[90%] flex flex-col overflow-y-auto">
                <button className="absolute top-4 right-4 text-2xl" onClick={onClose}>
                    <IoMdClose />
                </button>

                <div className="flex justify-center items-center px-8 pt-10">
                    <Img src={book.image} alt={book.title} width={250} height={350} />
                </div>

                <div className="px-8 mt-6">
                    <h1 className="text-md text-gray-500">{book.title}</h1>
                    <span className="block mt-2">
                        Por: <span className="text-emerald-900">{book.author}</span>
                    </span>
                    <span className="block mt-2">
                        Categoria: <span className="text-emerald-900">{book.category}</span>
                    </span>
                    <span className="block mt-2">
                        Local: <span className="text-emerald-900">{book.place}</span>
                    </span>
                    <span className="block mt-2">
                        Quantidade: <span className="text-emerald-900">{book.amount}</span>
                    </span>
                    <h4 className="mt-6">
                        <BookStatus label={book?.status} />
                    </h4>
                </div>
            </div>
        </div>
    )
}
