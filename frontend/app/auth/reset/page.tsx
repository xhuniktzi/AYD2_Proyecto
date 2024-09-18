'use client'
import { useState } from 'react'
import { axiosInstance } from '@/tools/api'
import { useRouter, useSearchParams } from 'next/navigation'
import { IResetReq } from '@/models/IResetReq'
import { IMessageRes } from '@/models/IMessageRes'
import { AxiosError } from 'axios'

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [showModal, setShowModal] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    // Get the token from query parameters
    const token = searchParams.get('token') || ''

    async function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const resetData: IResetReq = {
            token: token,
            new_password: newPassword,
        }

        try {
            //   const response = 
            await axiosInstance.post<IMessageRes>('/auth/reset_password', resetData)
            // Show success modal
            setShowModal(true)
        } catch (error) {
            const axiosError = error as AxiosError<IMessageRes>

            if (axiosError.response) {
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
        // Redirect to login page
        router.push('/auth/login')
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
                    <h1 className="text-3xl font-bold text-center text-gray-800">Reset Password</h1>
                    {errorMsg && (
                        <p className="text-red-500 text-center">{errorMsg}</p>
                    )}
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
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
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white w-full max-w-md p-6 mx-auto rounded shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Password Reset Successful!</h2>
                        <p className="mb-6">
                            Your password has been reset successfully. You can now log in with your new password.
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
