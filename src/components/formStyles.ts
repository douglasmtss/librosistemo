import styled, { css } from 'styled-components'
import Link from 'next/link'

/* Estilos compartilhados dos formulários de cadastro/edição (ADR 0008 — conversão Tailwind → styled-components).
   Mapeamento 1:1 das classes utilitárias originais; cores via tokens de src/app/globals.css. */

/* p-8 */
export const FormContainer = styled.div`
    padding: 32px;
`

/* text-2xl */
export const FormTitle = styled.h2`
    font-size: 1.5rem;
    line-height: 2rem;
`

/* mt-4 */
export const Form = styled.form`
    margin-top: 16px;
`

/* border-2 border-gray-400 rounded-md p-2 w-full h-10 mb-4 */
export const TextInput = styled.input`
    border: 2px solid #9ca3af; /* gray-400 do Tailwind — sem token equivalente em globals.css */
    border-radius: 6px; /* rounded-md (6px) — entre --radius-sm (4px) e --radius-md (8px) */
    padding: 8px;
    width: 100%;
    height: 40px;
    margin-bottom: 16px;
`

/* igual ao TextInput, sem mb-4 (a margem fica no ImageFieldRow) */
export const ImageInput = styled(TextInput)`
    margin-bottom: 0;
`

/* flex items-center mb-4 */
export const ImageFieldRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 16px;
`

/* h-10 py-2 px-4 rounded-lg bg-primary ml-2 cursor-pointer text-white */
export const CameraButton = styled.button`
    height: 40px;
    padding: 8px 16px;
    border-radius: var(--radius-md);
    background-color: var(--color-primary);
    margin-left: 8px;
    cursor: pointer;
    color: var(--color-white);
`

/* flex w-full justify-between items-center */
export const FormActions = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
`

/* py-4 px-8 rounded-lg bg-primary text-white font-semibold */
const actionAppearance = css`
    padding: 16px 32px;
    border-radius: var(--radius-md);
    background-color: var(--color-primary);
    color: var(--color-white);
    font-weight: 600;
`

export const CancelLink = styled(Link)`
    ${actionAppearance}
`

export const SubmitButton = styled.button`
    ${actionAppearance}
`
