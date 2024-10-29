'use client'
import { useState } from 'react'
import { axiosInstance } from '@/tools/api'
import { useRouter } from 'next/navigation'

import { IMessageRes } from '@/models/IMessageRes'
import { AxiosError } from 'axios'
import { ILoginAssistantReq } from '@/models/ILoginAssistantReq'
import { ILoginAssistantResOk } from './ILoginAssistantResOk'

export default function LoginAssistantPage() {
    const [dpiOrEmail, setDpiOrEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const router = useRouter()

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const loginData: ILoginAssistantReq = {
            password: password,
        }

        // Determine if the input is an email or DPI number
        if (dpiOrEmail.includes('@')) {
            loginData.email = dpiOrEmail
        } else {
            loginData.dpi_number = dpiOrEmail
        }

        try {
            const response = await axiosInstance.post<ILoginAssistantResOk>('/auth/assistant/login', loginData)
            const { access_token } = response.data

            // Store the token securely (e.g., in HTTP-only cookies)
            localStorage.setItem('access_token', access_token)

            // Redirect to the desired page after successful login
            router.push('/assistant/applicants')
        } catch (error) {
            const axiosError = error as AxiosError<IMessageRes>

            if (axiosError.response && axiosError.response.status === 401) {
                const data = axiosError.response.data
                setErrorMsg(data.msg)
            } else {
                setErrorMsg('An unexpected error occurred.')
            }
        }
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
                    <h1 className="text-3xl font-bold text-center text-gray-800">Driver Login</h1>
                    {errorMsg && (
                        <p className="text-red-500 text-center">{errorMsg}</p>
                    )}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label htmlFor="dpiOrEmail" className="block text-sm font-medium text-gray-700">
                                DPI Number or Email
                            </label>
                            <input
                                type="text"
                                id="dpiOrEmail"
                                name="dpiOrEmail"
                                placeholder="Enter your DPI number or email"
                                value={dpiOrEmail}
                                onChange={(e) => setDpiOrEmail(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <button type="button" onClick={() => router.push('/auth/register_driver')} className="font-medium text-blue-600 hover:text-blue-500">
                                    Register as a Driver
                                </button>
                            </div>
                            {/* <div className="text-sm">
                                <button type="button" onClick={() => router.push('/auth/forgot_driver')} className="font-medium text-blue-600 hover:text-blue-500">
                                    Forgot your password?
                                </button>
                            </div> */}
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
