'use client'
import { useState } from 'react'
import { axiosInstance } from '@/tools/api'
import { useRouter } from 'next/navigation'
import { IRegisterReq } from '@/models/IRegisterReq'
import { IRegisterRes } from '@/models/IRegisterRes'
import { IMessageRes } from '@/models/IMessageRes'
import { AxiosError } from 'axios'

export default function RegisterPage() {
    const [fullname, setFullname] = useState('')
    const [fechaNac, setFechaNac] = useState('')
    const [password, setPassword] = useState('')
    const [genero, setGenero] = useState(0)
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [generatedUsername, setGeneratedUsername] = useState('')
    const router = useRouter()

    // Function to format date to dd/mm/yyyy
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }

    async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        // Format the date to dd/mm/yyyy
        const formattedDate = formatDate(fechaNac)

        const registerData: IRegisterReq = {
            fullname: fullname,
            fecha_nac: formattedDate,
            password: password,
            genero: genero,
            email: email,
            phone: phone,
        }

        try {
            const response = await axiosInstance.post<IRegisterRes>('/auth/register', registerData)
            const { username } = response.data

            // Set the generated username and show the modal
            setGeneratedUsername(username)
            setShowModal(true)
        } catch (error) {
            const axiosError = error as AxiosError<IMessageRes>

            if (axiosError.response && axiosError.response.status === 400) {
                const data = axiosError.response.data
                setErrorMsg(data.msg)
            } else {
                setErrorMsg('An unexpected error occurred.')
            }
        }
    }

    // Function to handle modal close and redirect to login
    const handleModalClose = () => {
        setShowModal(false)
        router.push('/auth/login')
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
                    <h1 className="text-3xl font-bold text-center text-gray-800">Register</h1>
                    {errorMsg && (
                        <p className="text-red-500 text-center">{errorMsg}</p>
                    )}
                    <form onSubmit={handleRegister} className="space-y-5">
                        <div>
                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullname"
                                name="fullname"
                                placeholder="Enter your full name"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                           placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="fechaNac" className="block text-sm font-medium text-gray-700">
                                Fecha de Nacimiento
                            </label>
                            <input
                                type="date"
                                id="fechaNac"
                                name="fechaNac"
                                placeholder="dd/mm/yyyy"
                                value={fechaNac}
                                onChange={(e) => setFechaNac(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                           placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
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
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                           placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="genero" className="block text-sm font-medium text-gray-700">
                                Género
                            </label>
                            <select
                                id="genero"
                                name="genero"
                                value={genero}
                                onChange={(e) => setGenero(Number(e.target.value))}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                           bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value={0}>Ninguno</option>
                                <option value={1}>Femenino</option>
                                <option value={2}>Masculino</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                           placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
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
                            Register
                        </button>
                    </form>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white w-full max-w-md p-6 mx-auto rounded shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
                        <p className="mb-4">Your generated username is:</p>
                        <p className="text-lg font-semibold mb-6">{generatedUsername}</p>
                        <button
                            onClick={handleModalClose}
                            className="w-full flex justify-center py-2 px-4 border border-transparent 
                         rounded-md shadow-sm text-sm font-medium text-white bg-green-600 
                         hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-green-500"
                        >
                            Proceed to Login
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
