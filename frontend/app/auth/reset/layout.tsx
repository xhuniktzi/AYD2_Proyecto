import { Metadata } from 'next'


export const metadata: Metadata = {
  title: "Reiniciar contraseña",
  description: "Proyecto de AYD 2",
};


export default function AuthResetLayout({
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