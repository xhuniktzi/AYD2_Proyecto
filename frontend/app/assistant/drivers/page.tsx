"use client";
import { axiosInstance } from "@/tools/api";
import { AxiosError } from "axios";
import Driver from "@/models/AssistantDriversRes";
import { IMessageRes } from "@/models/IMessageRes";
import { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { User as UserIcon, MapPin, MapPinCheckInside } from "lucide-react";

export default function DriverPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [errMsg, setErrMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [driverDetails, setDriverDetails] = useState<Driver>({
    driver_id: "",
    fullname: "",
    genero: "",
    email: "",
    phone_number: "",
    dpi_number: "",
    car_brand: "",
    car_model_year: "",
    plate_number: "",
    age: "",
    trips: [],
  });

  useEffect(() => {
    axiosInstance
      .get<Driver[]>("/assistant/drivers")
      .then((response) => {
        setDrivers(response.data);
      })
      .catch((error) => {
        const axiosError = error as AxiosError<IMessageRes>;
        if (axiosError.response) {
          setErrMsg(axiosError.response.data.msg);
        } else {
          setErrMsg("Un error inesperado ha ocurrido");
        }
      });
  }, []);

  async function getDriverDetails(id: string) {
    try {
      const response = await axiosInstance.get<Driver>(
        `/assistant/drivers/${id}`
      );
      setDriverDetails(response.data);
      setOpen(true);
    } catch (error) {
      const axiosError = error as AxiosError<IMessageRes>;
      if (axiosError.response) {
        setErrMsg(axiosError.response.data.msg);
      } else {
        setErrMsg("Un error inesperado ha ocurrido");
      }
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader className="mb-5">
            <SheetTitle>Detalle cliente</SheetTitle>
          </SheetHeader>
          <div className="flex">
            <UserIcon />
            <h2 className="text-lg font-bold">{driverDetails.fullname}</h2>
          </div>
          {Object.entries(driverDetails)
            .filter(
              ([key, _]) =>
                key !== "fullname" && key !== "driver_id" && key !== "trips"
            )
            .map(([key, value]) => (
              <div key={key}>
                <h3 className="text font-semibold">
                  {key.replaceAll("_", " ")}
                </h3>
                <p className="text-sm">{value}</p>
              </div>
            ))}
          <h2 className="text-lg font-bold mt-5">Viajes</h2>
          <hr className="border-black mb-3" />
          {driverDetails.trips!.length > 0 ? (
            driverDetails.trips!.map((trip) => (
              <div key={trip.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{trip.passenger}</CardTitle>
                    <CardDescription>{trip.start_time}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="font-semibold">
                      <MapPin className="inline" /> Origen
                    </span>
                    <p>{trip.origin}</p>
                    <span className="font-semibold">
                      <MapPinCheckInside className="inline" /> Destino
                    </span>
                    <p>{trip.destination}</p>
                  </CardContent>
                  <CardFooter>
                    <span className="font-bold">{trip.status}</span>
                  </CardFooter>
                </Card>
              </div>
            ))
          ) : (
            <p>No hay viajes</p>
          )}
          <hr className="border-2 my-3" />
          <Button variant={"destructive"}>Eliminar cliente</Button>
        </SheetContent>
      </Sheet>

      <h1 className="text-lg font-bold">Users</h1>
      {errMsg && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errMsg}</AlertDescription>
        </Alert>
      )}
      {!errMsg && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>id</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.driver_id}>
                <TableCell>{driver.driver_id}</TableCell>
                <TableCell>
                  <Button
                    variant={"link"}
                    onClick={() => getDriverDetails(driver.driver_id)}
                  >
                    {driver.fullname}
                  </Button>
                </TableCell>
                <TableCell>{driver.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
