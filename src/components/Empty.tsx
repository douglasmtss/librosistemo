'use client'
import { FaRegFolderOpen } from 'react-icons/fa'
import styled from 'styled-components'

export const Empty = (): React.ReactNode => {
    return (
        <EmptyContainer>
            <EmptyFrame>
                <FolderIcon />
                <EmptyMessage>Nenhum dado foi econtrado</EmptyMessage>
            </EmptyFrame>
        </EmptyContainer>
    )
}

const EmptyContainer = styled.div`
    padding: 32px;
`

const EmptyFrame = styled.div`
    min-width: 250px;
    min-height: 250px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: var(--radius-md);
    border: 4px solid var(--color-gray-200);
`

const FolderIcon = styled(FaRegFolderOpen)`
    color: var(--color-gray-300);
    font-size: 128px;
    line-height: 1;
`

const EmptyMessage = styled.span`
    color: #9ca3af; /* gray-400 — não existe token equivalente em globals.css */
    font-size: 20px;
    line-height: 28px;
`
