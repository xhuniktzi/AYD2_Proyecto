'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { axiosInstance } from '@/tools/api'
import { useRouter } from 'next/navigation'
import { IMessageRes } from '@/models/IMessageRes'
import { AxiosError } from 'axios'
import dynamic from 'next/dynamic'

// Envolver el componente con `dynamic` para que se ejecute solo en el cliente
const verifyAdmin = () => {
    const [file, setFile] = useState<File | null>(null)
    const [isVerifying, setIsVerifying] = useState(false)
    const router = useRouter()
    const [message, setMessage] = useState('')

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files ? event.target.files[0] : null
        if (uploadedFile && uploadedFile.name.endsWith('.ayd')) {
            setFile(uploadedFile)
            setMessage('')
        } else {
            setMessage('Por favor, sube un archivo con extensión .ayd')
        }
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        if (!file) return setMessage('Primero selecciona un archivo .ayd')

        setIsVerifying(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await axiosInstance.post<IMessageRes>('/admin/verifyTwo', formData)
            const data = response.data
            if (data.msg === 'Autenticación exitosa') {
                alert('Autenticación exitosa')
                router.push('/admin/dashboard')
            } else {
                setMessage(data.msg || 'Error de autenticación')
            }
        } catch (error) {
            const axiosError = error as AxiosError<IMessageRes>
            if (axiosError.response) {
                const data = axiosError.response.data
                setMessage(data.msg)
            } else {
                setMessage('Ocurrió un error inesperado.')
            }
        } finally {
            setIsVerifying(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg text-center">
                {!message && (
                    <>
                        <h1 className="text-3xl font-bold text-gray-800">Inicio de sesión de Administrador</h1>
                        <p className="mt-4">Carga el archivo de verificación para continuar.</p>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".ayd"
                                className="mt-4 mb-2"
                            />
                            <button
                                type="submit"
                                className={`mt-6 w-full flex justify-center py-2 px-4 border border-transparent 
                                rounded-md shadow-sm text-sm font-medium text-white 
                                ${isVerifying ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                                disabled={isVerifying}
                            >
                                {isVerifying ? 'Verificando...' : 'Iniciar sesión'}
                            </button>
                        </form>
                    </>
                )}
                {message && (
                    <>
                        <h1 className="text-3xl font-bold text-gray-800">Autenticación Fallida</h1>
                        <p className="mt-4 text-red-500">{message}</p>
                        <button
                            onClick={() => router.push('/')}
                            className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent 
                            rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 
                            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                            focus:ring-blue-500"
                        >
                            Regresar a Inicio
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default dynamic(() => Promise.resolve(verifyAdmin), { ssr: false })