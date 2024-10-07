'use client'
import { useState } from 'react'
import { axiosInstance } from '@/tools/api'
import { useRouter } from 'next/navigation'
import { ILoginReq } from '@/models/ILoginReq'
import { ILoginResOk } from '@/models/ILoginResOk'
import { IMessageRes } from '@/models/IMessageRes'
import { AxiosError } from 'axios'


export default function LoginPage() {
    const [usernameOrEmail, setUsernameOrEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const router = useRouter()

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const loginData: ILoginReq = {
            password: password,
        }

        // Determine if the input is an email or username
        if (usernameOrEmail.includes('@')) {
            loginData.email = usernameOrEmail
        } else {
            loginData.username = usernameOrEmail
        }

        try {
            const response = await axiosInstance.post<ILoginResOk>('/auth/admin/login', loginData)
            const { access_token } = response.data

            // Store the token securely (e.g., in HTTP-only cookies)
            localStorage.setItem('access_token', access_token)

            // Redirect to the desired page after successful login
            router.push('/user/request')
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
                    <h1 className="text-3xl font-bold text-center text-gray-800">Login Admin</h1>
                    {errorMsg && (
                        <p className="text-red-500 text-center">{errorMsg}</p>
                    )}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700">
                                Username or Email
                            </label>
                            <input
                                type="text"
                                id="usernameOrEmail"
                                name="usernameOrEmail"
                                placeholder="Enter your username or email"
                                value={usernameOrEmail}
                                onChange={(e) => setUsernameOrEmail(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                         placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                         placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex items-center justify-between">

                            <div className="text-sm">
                                <button type="button" onClick={() => router.push('/auth/register')} className="font-medium text-blue-600 hover:text-blue-500">
                                    Register
                                </button>
                            </div>

                            <div className="text-sm">
                                <button type="button" onClick={() => router.push('/auth/forgot')} className="font-medium text-blue-600 hover:text-blue-500">
                                    Forgot your password?
                                </button>
                            </div>


                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent 
                       rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                       focus:ring-blue-500"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>

    )
}
