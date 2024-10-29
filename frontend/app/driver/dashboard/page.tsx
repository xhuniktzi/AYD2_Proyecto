
'use client'
import { useState, useEffect } from 'react';
import { axiosInstance } from '@/tools/api';
import { useRouter } from 'next/navigation';
import { ITripDriverInfo } from '@/models/ITripDriverInfo';
import { AxiosError } from 'axios';
import { IMessageRes } from '@/models/IMessageRes';

export default function TripInfoListPage() {
  const [trips, setTrips] = useState<ITripDriverInfo[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchTrips() {
      try {
        const response = await axiosInstance.get<ITripDriverInfo[]>('/driver/trips');
        setTrips(response.data);
      } catch (error) {
        console.error('Error fetching trips', error);
      }
    }
    // Initial fetch
    fetchTrips();
  }, []);

  async function handleAcceptTrip(tripId: number) {
    try {
      await axiosInstance.post<IMessageRes>(`/driver/accept_trip`, { trip_id: tripId, driver_id: 1 });
      router.push(`/driver/driver_trip/${tripId}`)
    } catch (error) {
      const axiosError = error as AxiosError<IMessageRes>;
      if (axiosError.response) {
        setErrorMsg(axiosError.response.data.msg);
      } else {
        setErrorMsg('An unexpected error occurred.');
      }
    }
  }

  async function handleActionsTrip(tripId: number) {
    try {
      router.push(`/driver/driver_trip/${tripId}`)
    } catch (error) {
      setErrorMsg('An unexpected error occurred.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white shadow-md rounded-lg">
        {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}
        <h1 className="text-3xl font-bold text-center text-gray-800">Trips List</h1>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Trip ID</th>
              <th className="px-4 py-2">Origin</th>
              <th className="px-4 py-2">Destination</th>
              <th className="px-4 py-2">Tarifa</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.trip_id}>
                <td className="border px-4 py-2">{trip.trip_id}</td>
                <td className="border px-4 py-2">{trip.origin}</td>
                <td className="border px-4 py-2">{trip.destination}</td>
                <td className="border px-4 py-2">Q{trip.tarifa}</td>
                <td className="border px-4 py-2">
                  { trip.status == 1 ? ( //pendiente
                  <button
                    onClick={() => handleAcceptTrip(trip.trip_id)}
                    className="py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                    Accept Trip
                  </button>)
                  : trip.status == 2 ? ( //Cancelado
                    <button
                    className="py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                    Canceled
                  </button>)
                  : trip.status == 3 ? ( // En progreso
                    <>
                      <button
                    className="py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    Indrive
                  </button>
                  <button
                  onClick={() => handleActionsTrip(trip.trip_id)}
                  className="py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-blue-700">
                  Actions
                </button>
                    </>
                    )
                  : ( // Completado
                    <button
                    className="py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700">
                    Completed
                  </button>)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
