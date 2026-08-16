'use client'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'

export const Scan = (): React.ReactNode => {
    const [scanResult, setScanResult] = useState<null | string>(null)

    useEffect(() => {
        const sound = new Audio('/audios/barcode.wav')
        const scanner = new Html5QrcodeScanner(
            'reader',
            {
                qrbox: {
                    width: 250,
                    height: 250
                },
                fps: 5
            },
            false
        )

        function success(result: string): void {
            scanner.clear()
            setScanResult(result)
            sound.play()
        }

        function error(err: string): void {
            console.warn(err)
            scanner.resume()
            scanner.clear()
        }

        scanner.render(success, error)

        return (): void => {
            scanner.clear()
        }
    }, [])

    if (scanResult) {
        return (
            <ScanResultContainer>
                <h2>Succcess: {scanResult}</h2>
                <SearchLink href={`/pages/dashboard/book-registration/${scanResult}`}>Pesquisar</SearchLink>
            </ScanResultContainer>
        )
    }

    return (
        <StyledDiv>
            <ReaderArea id="reader"></ReaderArea>
        </StyledDiv>
    )
}

const ScanResultContainer = styled.div`
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media (min-width: 768px) {
        width: 100%;
    }
`

const SearchLink = styled(Link)`
    padding: 16px 24px;
    background-color: var(--color-success);
    border-radius: var(--radius-md);
    color: var(--color-white);
`

const ReaderArea = styled.div`
    width: 100%;
`

const StyledDiv = styled.div`
    display: flex;
    justify-content: center;
    border: 4px solid var(--color-black);

    #html5-qrcode-button-camera-permission {
        background-color: var(--color-primary);
        color: var(--color-white);
        padding: 4px 8px;
        cursor: pointer;
    }
    #reader__dashboard_section_csr {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    #html5-qrcode-button-camera-stop,
    #html5-qrcode-button-camera-start {
        background-color: var(--color-primary);
        color: var(--color-white);
        padding: 4px 8px;
        cursor: pointer;
        margin-top: 4px;
        margin-bottom: 4px;
    }
`
