// models/ITripInfo.ts
export interface ITripDriverInfo {
    trip_id: number;
    origin: string;
    destination: string;
    tarifa: number;
    status: string;
    user_fullname?: string;
    email?: string;
    phone_number?: string;
    genero?: string;
  }