'use client'
// DriverTripPage.tsx - Display Info After Accepting Trip
import { useState, useEffect } from 'react';
import { axiosInstance } from '@/tools/api';
import { useParams, useRouter } from 'next/navigation';
import { IMessageRes } from '@/models/IMessageRes';
import { AxiosError } from 'axios';
import { ITripDriverInfo } from '@/models/ITripDriverInfo';
import { ICancelTripRes, IReportIssueReq, IReportIssueRes } from '../IStateTrip'

export default function DriverTripPage() {
  const [tripInfo, setTripInfo] = useState<ITripDriverInfo | null>(null);
  const [reportText, setReportText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { trip_id } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchTripInfo() {
      try {
        const response = await axiosInstance.get<ITripDriverInfo>(`/driver/user_trip/${trip_id}`);
        setTripInfo(response.data);
      } catch (error) {
        console.error('Error fetching trip info', error);
      }
    }
    fetchTripInfo();
  }, [trip_id]);

  async function handleCancelTrip() {
    try {
      await axiosInstance.post<ICancelTripRes>(`/driver/cancel_trip`, { trip_id, driver_id: 1 });
      router.push('/driver/dashboard');
    } catch (error) {
      const axiosError = error as AxiosError<IMessageRes>;
      if (axiosError.response) {
        setErrorMsg(axiosError.response.data.msg);
      } else {
        setErrorMsg('An unexpected error occurred.');
      }
    }
  }

  async function handleCompleteTrip() {
    try {
      await axiosInstance.post<ICancelTripRes>(`/driver/complete_trip`, { trip_id, driver_id: 1 });
      router.push('/driver/dashboard');
    } catch (error) {
      const axiosError = error as AxiosError<IMessageRes>;
      if (axiosError.response) {
        setErrorMsg(axiosError.response.data.msg);
      } else {
        setErrorMsg('An unexpected error occurred.');
      }
    }
  }

  async function handleReportIssue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const reportData: IReportIssueReq = { description: reportText };
    try {
      await axiosInstance.post<IReportIssueRes>(`/driver/report_issue`, reportData);
      setReportText('');
    } catch (error) {
      const axiosError = error as AxiosError<IMessageRes>;
      if (axiosError.response) {
        setErrorMsg(axiosError.response.data.msg);
      } else {
        setErrorMsg('An unexpected error occurred.');
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
            <p><strong>Full name: </strong> {tripInfo.fullname}</p>
            <p><strong>Email:</strong> {tripInfo.email}</p>
            <p><strong>Phone Number:</strong> {tripInfo.phone_number}</p>
            <button
              onClick={handleCompleteTrip}
              className="w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Complete Trip
            </button>
            <button
              onClick={handleCancelTrip}
              className="w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
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
                className="w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Report Issue
              </button>
            </form>
          </>
        ) : (
          <p>Loading trip info...</p>
        )}
      </div>
    </div>
  );
}