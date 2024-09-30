'use client'
import { useState, useEffect } from 'react'
import { axiosInstance } from '@/tools/api'
import { useRouter, useParams } from 'next/navigation'
import { IMessageRes } from '@/models/IMessageRes'
import { AxiosError } from 'axios'
import { ITripInfo } from '@/models/ITripInfo'
import { ICancelTripRes } from '@/models/ICancelTripRes'
import { IReportIssueReq } from '@/models/IReportIssueReq'
import { IReportIssueRes } from '@/models/IReportIssueRes'

export default function TripInfoPage() {
    const [tripInfo, setTripInfo] = useState<ITripInfo | null>(null)
    const [reportText, setReportText] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const { trip_id } = useParams()
    const router = useRouter()

    useEffect(() => {
        async function fetchTripInfo() {
            try {
                const response = await axiosInstance.get<ITripInfo>(`/user/info/${trip_id}`)
                setTripInfo(response.data)
            } catch (error) {
                console.error('Error fetching trip info', error)
            }
        }

        // Poll the API every 5 seconds to check for driver assignment
        const intervalId = setInterval(() => {
            fetchTripInfo()
        }, 5000)

        // Initial fetch
        fetchTripInfo()

        // Clear the interval on component unmount
        return () => clearInterval(intervalId)
    }, [trip_id])

    async function handleCancelTrip() {
        try {
            await axiosInstance.post<ICancelTripRes>(`/user/cancel/${trip_id}`)
            router.push('/user/request')
        } catch (error) {
            const axiosError = error as AxiosError<IMessageRes>
            if (axiosError.response) {
                setErrorMsg(axiosError.response.data.msg)
            } else {
                setErrorMsg('An unexpected error occurred.')
            }
        }
    }

    async function handleReportIssue(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const reportData: IReportIssueReq = { description: reportText }
        try {
            await axiosInstance.post<IReportIssueRes>(`/user/report/${trip_id}`, reportData)
            setReportText('')
        } catch (error) {
            const axiosError = error as AxiosError<IMessageRes>
            if (axiosError.response) {
                setErrorMsg(axiosError.response.data.msg)
            } else {
                setErrorMsg('An unexpected error occurred.')
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
                {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}
                {tripInfo ? (
                    <>
                        <h1 className="text-3xl font-bold text-center text-gray-800">Trip Info</h1>
                        <p><strong>Origin:</strong> {tripInfo.origin}</p>
                        <p><strong>Destination:</strong> {tripInfo.destination}</p>
                        <p><strong>Tarifa:</strong> Q{tripInfo.tarifa}</p>

                        {tripInfo.status === "Driver assigned" ? (
                            <>
                                <p><strong>Driver:</strong> {tripInfo.driver_name}</p>
                                <p><strong>Car Brand:</strong> {tripInfo.car_brand}</p>
                                <p><strong>Car Model Year:</strong> {tripInfo.car_model_year}</p>
                                <p><strong>Plate Number:</strong> {tripInfo.plate_number}</p>
                            </>
                        ) : (
                            <p>Waiting for a driver to be assigned...</p>
                        )}

                        <button
                            onClick={handleCancelTrip}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                        >
                            Cancel Trip
                        </button>

                        <form onSubmit={handleReportIssue} className="space-y-5 mt-5">
                            <textarea
                                value={reportText}
                                onChange={(e) => setReportText(e.target.value)}
                                placeholder="Describe the issue..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Report Issue
                            </button>
                        </form>
                    </>
                ) : (
                    <p>Loading trip info...</p>
                )}
            </div>
        </div>
    )
}
