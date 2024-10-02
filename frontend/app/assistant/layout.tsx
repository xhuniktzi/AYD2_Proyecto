import { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Asistente - QNave",
};

export default function AssistantLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-screen w-screen">
      <nav className="px-5 h-14 flex items-center border-b-2">
        <ul className="flex space-x-5">
          <li>
            <Button variant={"ghost"} asChild>
              <a href="users">Usuarios</a>
            </Button>
          </li>
          <li>
            <Button variant={"ghost"} asChild>
              <a href="applicants">Solicitudes empleo</a>
            </Button>
          </li>
        </ul>
      </nav>
      <div className="p-10">{children}</div>
    </div>
  );
}
