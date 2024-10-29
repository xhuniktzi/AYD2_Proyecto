import { Metadata } from 'next'


export const metadata: Metadata = {
    title: "Validar con Documento",
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