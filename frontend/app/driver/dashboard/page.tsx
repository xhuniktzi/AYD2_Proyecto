"use client";
import { axiosInstance } from "@/tools/api";
import { AxiosError } from "axios";
import User from "@/models/IUser";
import Trip from "@/models/AssistantUsersTripsRes";
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

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [userTrips, setUserTrips] = useState<Trip[]>([]);
  const [errMsg, setErrMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<User>({
    id: 0,
    fullname: "",
    username: "",
    fecha_nac: "",
    genero: "",
    email: "",
    phone_number: "",
    state: "",
  });

  useEffect(() => {
    axiosInstance
      .get<User[]>("/driver/users")
      .then((response) => {
        console.log(response.data);
        setUsers(response.data);
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

  async function getUserDetails(id: number) {
    try {
      const response = await axiosInstance.get<User>(`/user_trip/${id}`);
      setUserDetails(response.data);
      getTrips(id);
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

  async function getTrips(id: number) {
    try {
      const response = await axiosInstance.get<Trip[]>(
        `/assistant/users/${id}/trips`
      );
      setUserTrips(response.data);
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
            <h2 className="text-lg font-bold">{userDetails.fullname}</h2>
          </div>
          {Object.entries(userDetails)
            .filter(([key, _]) => key !== "fullname" && key !== "id")
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
          {userTrips.length > 0 ? (
            userTrips.map((trip) => (
              <div key={trip.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{trip.driver}</CardTitle>
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
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  <Button
                    variant={"link"}
                    onClick={() => getUserDetails(user.id)}
                  >
                    {user.fullname}
                  </Button>
                </TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
