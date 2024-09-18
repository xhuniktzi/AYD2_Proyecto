import { Metadata } from 'next'


export const metadata: Metadata = {
    title: "Verificar contraseña",
    description: "Proyecto de AYD 2",
};


export default function AuthVerifyLayout({
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