import { Metadata } from 'next'


export const metadata: Metadata = {
    title: "Recuperar contraseña",
    description: "Proyecto de AYD 2",
};


export default function AuthForgotLayout({
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