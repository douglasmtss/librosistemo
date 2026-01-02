import Link from 'next/link'

export default function Dashboard(): JSX.Element {
    return (
        <div className="w-full max-w-[740px] mx-auto">
            <div className="w-full flex flex-col justify-center items-center mb-8">
                <Link
                    href={'/pages/dashboard/books'}
                    className="py-2 px-4 bg-primary text-white w-80 text-center mt-8 font-semibold uppercase"
                >
                    Livros
                </Link>
                <Link
                    href={'/pages/dashboard/users'}
                    className="py-2 px-4 bg-primary text-white w-80 text-center mt-8 font-semibold uppercase"
                >
                    Usuários
                </Link>

                <Link
                    href={'/pages/dashboard/lends'}
                    className="py-2 px-4 bg-primary text-white w-80 text-center mt-8 font-semibold uppercase"
                >
                    Empréstimos
                </Link>
            </div>
        </div>
    )
}
