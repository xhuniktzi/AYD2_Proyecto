import { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Conductor - QNave",
};

export default function DriverLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-screen w-screen">
      <nav className="px-5 h-14 flex items-center border-b-2">
        <ul className="flex space-x-5">
          <li>
            <Button variant={"ghost"} asChild>
              <a href="/driver/dashboard">Lista de Viajes</a>
            </Button>
          </li>
          <li>
            <Button variant={"ghost"} asChild>
              <a href="reports">Reportar Problema</a>
            </Button>
          </li>
        </ul>
      </nav>
      <div className="p-10">{children}</div>
    </div>
  );
}
