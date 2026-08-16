'use client'
import styled from 'styled-components'

interface DeleteModalProps {
    onCancel: () => void
    onConfirm: () => void
}
export const DeleteModal = (props: DeleteModalProps): React.ReactNode => {
    const { onCancel, onConfirm } = props

    return (
        <Overlay>
            <ActionsWrapper>
                <CancelButton onClick={onCancel}>Cancelar</CancelButton>

                <ConfirmButton onClick={onConfirm}>Confirmar</ConfirmButton>
            </ActionsWrapper>
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

const ActionsWrapper = styled.div`
    position: relative;
    width: 90%;
    max-width: 500px;
    display: flex;
    overflow-y: auto;
`

const ActionButton = styled.button`
    padding: 16px 8px;
    border-radius: var(--radius-md);
    color: var(--color-white);
    flex: 1 1 0%;
`

const CancelButton = styled(ActionButton)`
    background-color: var(--color-primary);
`

const ConfirmButton = styled(ActionButton)`
    background-color: var(--color-danger);
    margin-left: 32px;
`
