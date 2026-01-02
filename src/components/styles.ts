import styled from 'styled-components'

export const PaginatedContainer = styled.div<{
    disabled: boolean
}>`
    ul[role='navigation'] {
        display: flex;
        padding: 2rem;
        max-width: 600px;
        margin: 2rem auto;

        li {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        li.next,
        li.previous {
            background-color: #0b8ec2;
            padding: 4px 8px;
            color: #fff;
            width: 100px;
            border-radius: 4px;
            opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
        }
    }
`
