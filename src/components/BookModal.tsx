'use client'
import { IoMdClose } from 'react-icons/io'
import styled from 'styled-components'
import { Img } from './Img'
import { BookStatus } from './BookStatus'

export const BookModal = (props: { book: Book | Record<string, never>; onClose: () => void }): React.ReactNode => {
    const { book, onClose } = props

    return (
        <Overlay>
            <ModalContent>
                <CloseButton onClick={onClose}>
                    <IoMdClose />
                </CloseButton>

                <ImageWrapper>
                    <Img src={book.image} alt={book.title} width={250} height={350} />
                </ImageWrapper>

                <DetailsSection>
                    <BookTitle>{book.title}</BookTitle>
                    <DetailRow>
                        Por: <DetailValue>{book.author}</DetailValue>
                    </DetailRow>
                    <DetailRow>
                        Categoria: <DetailValue>{book.category}</DetailValue>
                    </DetailRow>
                    <DetailRow>
                        Local: <DetailValue>{book.place}</DetailValue>
                    </DetailRow>
                    <DetailRow>
                        Quantidade: <DetailValue>{book.amount}</DetailValue>
                    </DetailRow>
                    <StatusHeading>
                        <BookStatus label={book?.status} />
                    </StatusHeading>
                </DetailsSection>
            </ModalContent>
        </Overlay>
    )
}

const Overlay = styled.div`
    z-index: 10;
    position: fixed;
    width: 100vw;
    height: 100vh;
    inset: 0;
    background-color: #0009;
    display: flex;
    justify-content: center;
    align-items: center;
`

const ModalContent = styled.div`
    position: relative;
    background-color: var(--color-white);
    width: 90%;
    max-width: 500px;
    height: 90%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
`

const CloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 24px;
    line-height: 32px;
`

const ImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 32px 0;
`

const DetailsSection = styled.div`
    padding: 0 32px;
    margin-top: 24px;
`

const BookTitle = styled.h1`
    color: var(--color-gray-500);
`

const DetailRow = styled.span`
    display: block;
    margin-top: 8px;
`

const DetailValue = styled.span`
    color: #064e3b;
`

const StatusHeading = styled.h4`
    margin-top: 24px;
`
