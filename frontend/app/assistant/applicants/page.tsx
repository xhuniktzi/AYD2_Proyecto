"use client";
import { axiosInstance } from "@/tools/api";
import { AxiosError } from "axios";
import Driver from "@/models/AssistantDriversRes";
import { IMessageRes } from "@/models/IMessageRes";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toaster } from "@/components/ui/sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function DriverPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    axiosInstance
      .get<Driver[]>("/assistant/applicants")
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

  async function hireApplicant(id: string) {
    await axiosInstance.patch(`/assistant/applicants/${id}/hire`);
    setDrivers(drivers.filter((driver) => driver.driver_id !== id));
    toast("Contratado!");
  }

  return (
    <>
      <h1 className="text-lg font-bold">Solicitudes empleo</h1>
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
              <TableHead>Marca auto</TableHead>
              <TableHead>Año</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.driver_id}>
                <TableCell>{driver.driver_id}</TableCell>
                <TableCell>{driver.fullname}</TableCell>
                <TableCell>{driver.car_brand}</TableCell>
                <TableCell>{driver.car_model_year}</TableCell>
                <TableCell>
                  <Button onClick={() => hireApplicant(driver.driver_id)}>
                    Contratar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Toaster />
    </>
  );
}
