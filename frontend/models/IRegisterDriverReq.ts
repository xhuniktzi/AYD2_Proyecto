// IRegisterDriverReq.ts
export interface IRegisterDriverReq {
    fullname: string;
    age: number;
    dpi_number: string;
    password: string;
    email: string;
    phone: string;
    address: string;
    genero_id: number; // 0: ninguno, 1: femenino, 2: masculino
    estado_civil_id: number; // Estado civil del conductor
    car_brand: string;
    car_model_year: number;
    plate_number: string;
    cv_pdf: string;
    photo: string;
    car_photo: string;
    account_number: string;
}
