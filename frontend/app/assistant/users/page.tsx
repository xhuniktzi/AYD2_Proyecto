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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { User as UserIcon, MapPin, MapPinCheckInside } from "lucide-react";

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [userTrips, setUserTrips] = useState<Trip[]>([]);
  const [errMsg, setErrMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [dialog_open, set_dialog_open] = useState(false);
  const [userDetails, setUserDetails] = useState<User>({
    id: 0,
    fullname: "",
    username: "",
    fecha_nac: "",
    genero: "",
    email: "",
    phone_number: "",
    state: "",
    comment: "",
  });

  useEffect(() => {
    axiosInstance
      .get<User[]>("/assistant/users")
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
      const response = await axiosInstance.get<User>(`/assistant/users/${id}`);
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

  async function deleteUser(formData) {
    const data = {
      id: userDetails.id,
      comment: formData.get("comment"),
    };
    await axiosInstance.post("/assistant/users", data);
    setUsers(
      users.map((user) => {
        if (user.id === userDetails.id) {
          user.state = "removed";
        }
        return user;
      })
    );
    set_dialog_open(false);
    setOpen(false);
  }

  function DeleteState() {
    if (userDetails.state === "removed") {
      return (
        <div>
          <h2 className="font-bold text-lg mt-3">Motivo eliminación</h2>
          <p className="text-red-800 border-black border-2 py-3 px-1">
            {userDetails.comment}
          </p>
        </div>
      );
    }
    return (
      <Button
        variant={"destructive"}
        className="mt-3"
        onClick={() => set_dialog_open(true)}
      >
        Eliminar cliente
      </Button>
    );
  }

  return (
    <>
      <Dialog open={dialog_open} onOpenChange={set_dialog_open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar usuario de la plataforma</DialogTitle>
            <DialogDescription>
              Provee un comentario para justificar esta acción
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-3" action={deleteUser}>
            <textarea
              rows={10}
              name="comment"
              required
              className="border-black border-2"
            ></textarea>
            <Button variant={"destructive"} type="submit">
              Eliminar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="overflow-y-scroll">
          <SheetHeader className="mb-5">
            <SheetTitle>Detalle cliente</SheetTitle>
          </SheetHeader>
          <div className="flex">
            <UserIcon />
            <h2 className="text-lg font-bold">{userDetails.fullname}</h2>
          </div>
          {Object.entries(userDetails)
            .filter(
              ([key, _]) =>
                key !== "fullname" && key !== "id" && key !== "comment"
            )
            .map(([key, value]) => (
              <div key={key}>
                <h3 className="text font-semibold">
                  {key.replaceAll("_", " ")}
                </h3>
                <p className="text-sm">{value}</p>
              </div>
            ))}
          <DeleteState></DeleteState>
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
        </SheetContent>
      </Sheet>
      <h1 className="text-lg font-bold">Usuarios</h1>
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
              <TableHead>status</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.state}</TableCell>
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
