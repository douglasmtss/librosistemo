'use client'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'

export const Scan = (): JSX.Element => {
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

        return () => {
            scanner.clear()
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (scanResult) {
        return (
            <div className="w-screen md:w-full flex flex-col items-center justify-center">
                <h2>Succcess: {scanResult}</h2>
                <Link
                    href={`/pages/dashboard/book-registration/${scanResult}`}
                    className="py-4 px-6 bg-green-500 rounded-lg text-white"
                >
                    Pesquisar
                </Link>
            </div>
        )
    }

    return (
        <StyledDiv>
            <div className="w-full" id="reader"></div>
        </StyledDiv>
    )
}

const StyledDiv = styled.div`
    display: flex;
    justify-content: center;
    border: 4px solid #000;

    #html5-qrcode-button-camera-permission {
        background-color: #0b8ec2;
        color: #fff;
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
        background-color: #0b8ec2;
        color: #fff;
        padding: 4px 8px;
        cursor: pointer;
        margin-top: 4px;
        margin-bottom: 4px;
    }
`
