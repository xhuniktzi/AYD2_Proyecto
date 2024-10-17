'use client'

import { useState } from 'react'
import { axiosInstance } from '@/tools/api'
import { useRouter, useSearchParams } from 'next/navigation'
import { IMessageRes } from '@/models/IMessageRes'
import { AxiosError } from 'axios'
import dynamic from 'next/dynamic'

// Envolver el componente con `dynamic` para que se ejecute solo en el cliente
const VerifyAccountPage = () => {
    const [message, setMessage] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    // Obtener el token de los parámetros de la URL
    const token = searchParams.get('token') || ''

    async function handleVerifyAccount() {
        if (!token) {
            setErrorMsg('Invalid token.')
            return
        }

        setIsVerifying(true)

        try {
            const response = await axiosInstance.get<IMessageRes>('/auth/verify', {
                params: { token },
            })
            const data = response.data
            setMessage(data.msg)
        } catch (error) {
            const axiosError = error as AxiosError<IMessageRes>
            if (axiosError.response) {
                const data = axiosError.response.data
                setErrorMsg(data.msg)
            } else {
                setErrorMsg('An unexpected error occurred.')
            }
        } finally {
            setIsVerifying(false)
        }
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg text-center">
                    {!message && !errorMsg && (
                        <>
                            <h1 className="text-3xl font-bold text-gray-800">Verify Account</h1>
                            <p className="mt-4">Click the button below to verify your account.</p>
                            <button
                                onClick={handleVerifyAccount}
                                className={`mt-6 w-full flex justify-center py-2 px-4 border border-transparent 
                           rounded-md shadow-sm text-sm font-medium text-white 
                           ${isVerifying ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                                disabled={isVerifying}
                            >
                                {isVerifying ? 'Verifying...' : 'Verify Account'}
                            </button>
                        </>
                    )}
                    {message && (
                        <>
                            <h1 className="text-3xl font-bold text-gray-800">Verification Successful</h1>
                            <p className="mt-4">{message}</p>
                            <button
                                onClick={() => router.push('/auth/login')}
                                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent 
                           rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 
                           hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                           focus:ring-blue-500"
                            >
                                Go to Login
                            </button>
                        </>
                    )}
                    {errorMsg && (
                        <>
                            <h1 className="text-3xl font-bold text-gray-800">Verification Failed</h1>
                            <p className="mt-4 text-red-500">{errorMsg}</p>
                            <button
                                onClick={() => router.push('/')}
                                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent 
                           rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 
                           hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                           focus:ring-blue-500"
                            >
                                Back to Home
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default dynamic(() => Promise.resolve(VerifyAccountPage), { ssr: false })

