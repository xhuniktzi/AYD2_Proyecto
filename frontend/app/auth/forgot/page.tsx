'use client'
import { useState } from 'react'
import { axiosInstance } from '@/tools/api'
import { useRouter } from 'next/navigation'
import { IForgotReq } from '@/models/IForgotReq'
import { IMessageRes } from '@/models/IMessageRes'
import { AxiosError } from 'axios'

export default function ForgotPasswordPage() {
    const [emailOrUsername, setEmailOrUsername] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [showModal, setShowModal] = useState(false)
    const router = useRouter()

    async function handleForgotPassword(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const forgotData: IForgotReq = {}

        // Determine if the input is an email or username
        if (emailOrUsername.includes('@')) {
            forgotData.email = emailOrUsername
        } else {
            forgotData.username = emailOrUsername
        }

        try {
            //   const response = 
            await axiosInstance.post<IMessageRes>('/auth/forgot_password', forgotData)
            // Show success modal
            setShowModal(true)
        } catch (error) {
            const axiosError = error as AxiosError<IMessageRes>

            if (axiosError.response && axiosError.response.status === 404) {
                const data = axiosError.response.data
                setErrorMsg(data.msg)
            } else {
                setErrorMsg('An unexpected error occurred.')
            }
        }
    }

    // Function to handle modal close
    const handleModalClose = () => {
        setShowModal(false)
        // Optionally redirect to another page
        router.push('/auth/login')
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
                    <h1 className="text-3xl font-bold text-center text-gray-800">Forgot Password</h1>
                    {errorMsg && (
                        <p className="text-red-500 text-center">{errorMsg}</p>
                    )}
                    <form onSubmit={handleForgotPassword} className="space-y-5">
                        <div>
                            <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700">
                                Email or Username
                            </label>
                            <input
                                type="text"
                                id="emailOrUsername"
                                name="emailOrUsername"
                                placeholder="Enter your email or username"
                                value={emailOrUsername}
                                onChange={(e) => setEmailOrUsername(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                           placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent 
                         rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-blue-500"
                        >
                            Send Reset Instructions
                        </button>
                    </form>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white w-full max-w-md p-6 mx-auto rounded shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Email Sent!</h2>
                        <p className="mb-6">
                            We have sent an email with instructions to reset your password.
                        </p>
                        <button
                            onClick={handleModalClose}
                            className="w-full flex justify-center py-2 px-4 border border-transparent 
                         rounded-md shadow-sm text-sm font-medium text-white bg-green-600 
                         hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-green-500"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
