import { Metadata } from 'next'


export const metadata: Metadata = {
  title: "Iniciar Sesión",
  description: "Proyecto de AYD 2",
};


export default function AuthLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
    </div>
  )
}