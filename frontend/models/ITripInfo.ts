export interface ITripInfo {
    origin: string;
    destination: string;
    tarifa: number;
    status: string; // "Driver assigned" or "Driver not assigned yet"
    driver_name?: string; // Optional, available only when driver is assigned
    car_brand?: string; // Optional
    car_model_year?: number; // Optional
    plate_number?: string; // Optional
    car_photo?: string; // Optional
}
