'use client'
import { useState } from 'react'
import { axiosInstance } from '@/tools/api'
import { useRouter } from 'next/navigation'
import { IRegisterDriverReq } from '@/models/IRegisterDriverReq'
import { IRegisterDriverRes } from '@/models/IRegisterDriverRes'
import { IMessageRes } from '@/models/IMessageRes'
import { AxiosError } from 'axios'

export default function RegisterDriverPage() {
    const [fullname, setFullname] = useState('')
    const [age, setAge] = useState('')
    const [dpiNumber, setDpiNumber] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [generoId, setGeneroId] = useState(0)
    const [estadoCivilId, setEstadoCivilId] = useState(1)
    const [carBrand, setCarBrand] = useState('')
    const [carModelYear, setCarModelYear] = useState('')
    const [plateNumber, setPlateNumber] = useState('')
    const [cvPdf, setCvPdf] = useState('')
    const [photo, setPhoto] = useState('')
    const [carPhoto, setCarPhoto] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [generatedDriverId, setGeneratedDriverId] = useState('')
    const router = useRouter()

    async function handleRegisterDriver(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const registerData: IRegisterDriverReq = {
            fullname,
            age: parseInt(age),
            dpi_number: dpiNumber,
            password,
            email,
            phone,
            address,
            genero_id: generoId,
            estado_civil_id: estadoCivilId,
            car_brand: carBrand,
            car_model_year: parseInt(carModelYear),
            plate_number: plateNumber,
            cv_pdf: cvPdf,
            photo,
            car_photo: carPhoto,
            account_number: accountNumber,
        }

        try {
            const response = await axiosInstance.post<IRegisterDriverRes>('/auth/register_driver', registerData)
            const { driver_id } = response.data

            // Set the generated driver ID and show the modal
            setGeneratedDriverId(driver_id)
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
                    <h1 className="text-3xl font-bold text-center text-gray-800">Register Driver</h1>
                    {errorMsg && (
                        <p className="text-red-500 text-center">{errorMsg}</p>
                    )}
                    <form onSubmit={handleRegisterDriver} className="space-y-5">
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
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                                Age
                            </label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                placeholder="Enter your age"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="dpiNumber" className="block text-sm font-medium text-gray-700">
                                DPI Number
                            </label>
                            <input
                                type="text"
                                id="dpiNumber"
                                name="dpiNumber"
                                placeholder="Enter your DPI number"
                                value={dpiNumber}
                                onChange={(e) => setDpiNumber(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
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
                                required
                            />
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
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                placeholder="Enter your address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="generoId" className="block text-sm font-medium text-gray-700">
                                Gender
                            </label>
                            <select
                                id="generoId"
                                name="generoId"
                                value={generoId}
                                onChange={(e) => setGeneroId(Number(e.target.value))}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value={0}>Ninguno</option>
                                <option value={1}>Femenino</option>
                                <option value={2}>Masculino</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="estadoCivilId" className="block text-sm font-medium text-gray-700">
                                Marital Status
                            </label>
                            <select
                                id="estadoCivilId"
                                name="estadoCivilId"
                                value={estadoCivilId}
                                onChange={(e) => setEstadoCivilId(Number(e.target.value))}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                
                                <option value={1}>Single</option>
                                <option value={2}>Married</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="carBrand" className="block text-sm font-medium text-gray-700">
                                Car Brand
                            </label>
                            <input
                                type="text"
                                id="carBrand"
                                name="carBrand"
                                placeholder="Enter your car brand"
                                value={carBrand}
                                onChange={(e) => setCarBrand(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="carModelYear" className="block text-sm font-medium text-gray-700">
                                Car Model Year
                            </label>
                            <input
                                type="number"
                                id="carModelYear"
                                name="carModelYear"
                                placeholder="Enter your car model year"
                                value={carModelYear}
                                onChange={(e) => setCarModelYear(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700">
                                Plate Number
                            </label>
                            <input
                                type="text"
                                id="plateNumber"
                                name="plateNumber"
                                placeholder="Enter your plate number"
                                value={plateNumber}
                                onChange={(e) => setPlateNumber(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="cvPdf" className="block text-sm font-medium text-gray-700">
                                CV (PDF)
                            </label>
                            <input
                                type="text"
                                id="cvPdf"
                                name="cvPdf"
                                placeholder="Enter CV PDF link"
                                value={cvPdf}
                                onChange={(e) => setCvPdf(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                                Driver Photo
                            </label>
                            <input
                                type="text"
                                id="photo"
                                name="photo"
                                placeholder="Enter photo link"
                                value={photo}
                                onChange={(e) => setPhoto(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="carPhoto" className="block text-sm font-medium text-gray-700">
                                Car Photo
                            </label>
                            <input
                                type="text"
                                id="carPhoto"
                                name="carPhoto"
                                placeholder="Enter car photo link"
                                value={carPhoto}
                                onChange={(e) => setCarPhoto(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                                Account Number
                            </label>
                            <input
                                type="text"
                                id="accountNumber"
                                name="accountNumber"
                                placeholder="Enter account number"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Register Driver
                        </button>
                    </form>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white w-full max-w-md p-6 mx-auto rounded shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
                        <p className="mb-4">Your generated driver ID is:</p>
                        <p className="text-lg font-semibold mb-6">{generatedDriverId}</p>
                        <button
                            onClick={handleModalClose}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Proceed to Login
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
