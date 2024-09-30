'use client'
import { useEffect, useState } from 'react'
import { axiosInstance } from '@/tools/api'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'
import { IMessageRes } from '@/models/IMessageRes'
import { IRequestTripReq } from '@/models/IRequestTripReq'
import { IRequestTripRes } from '@/models/IRequestTripRes'
import { ITarifa } from '@/models/ITarifa'

export default function RequestTripPage() {
    const [origins, setOrigins] = useState<string[]>([])
    const [destinations, setDestinations] = useState<string[]>([])
    const [selectedOrigin, setSelectedOrigin] = useState('')
    const [selectedDestination, setSelectedDestination] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const router = useRouter()

    // Fetch the available tariffs for origin and destination
    useEffect(() => {
        async function fetchTarifas() {
            try {
                const response = await axiosInstance.get<ITarifa[]>('/user/tarifas')
                const originsSet = new Set<string>()
                const destinationsSet = new Set<string>()
                response.data.forEach(tarifa => {
                    originsSet.add(tarifa.origin)
                    destinationsSet.add(tarifa.destination)
                })
                setOrigins(Array.from(originsSet))
                setDestinations(Array.from(destinationsSet))
            } catch (error) {
                console.error('Error fetching tarifas', error)
            }
        }
        fetchTarifas()
    }, [])

    async function handleRequestTrip(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const requestData: IRequestTripReq = {
            origin: selectedOrigin,
            destination: selectedDestination,
            tarifa: 25 // example tarifa value, replace with dynamic pricing logic if necessary
        }

        try {
            const response = await axiosInstance.post<IRequestTripRes>('/user/request', requestData)
            const { trip_id } = response.data

            // Redirect to trip info page
            router.push(`/user/info/${trip_id}`)
        } catch (error) {
            const axiosError = error as AxiosError<IMessageRes>
            if (axiosError.response && axiosError.response.status === 400) {
                setErrorMsg(axiosError.response.data.msg)
            } else {
                setErrorMsg('An unexpected error occurred.')
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800">Request Trip</h1>
                {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}
                <form onSubmit={handleRequestTrip} className="space-y-5">
                    <div>
                        <label htmlFor="origin" className="block text-sm font-medium text-gray-700">
                            Origin
                        </label>
                        <select
                            id="origin"
                            value={selectedOrigin}
                            onChange={(e) => setSelectedOrigin(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                            required
                        >
                            <option value="">Select origin</option>
                            {origins.map((origin) => (
                                <option key={origin} value={origin}>
                                    {origin}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                            Destination
                        </label>
                        <select
                            id="destination"
                            value={selectedDestination}
                            onChange={(e) => setSelectedDestination(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                            required
                        >
                            <option value="">Select destination</option>
                            {destinations.map((destination) => (
                                <option key={destination} value={destination}>
                                    {destination}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Request Trip
                    </button>
                </form>
            </div>
        </div>
    )
}
