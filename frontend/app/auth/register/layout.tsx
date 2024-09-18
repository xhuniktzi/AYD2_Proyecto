import { Metadata } from 'next'


export const metadata: Metadata = {
  title: "Registro",
  description: "Proyecto de AYD 2",
};


export default function AuthRegisterLayout({
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