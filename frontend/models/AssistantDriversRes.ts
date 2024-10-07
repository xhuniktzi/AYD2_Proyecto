import Trip from "@/models/AssistantUsersTripsRes";

export default interface IDriver {
  driver_id: string;
  fullname: string;
  email: string;
  phone_number: string;
  age: string;
  dpi_number: string;
  car_brand: string;
  car_model_year: string;
  plate_number: string;
  genero: string;
  trips?: Trip[];
}
