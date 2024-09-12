import type { Metadata } from "next";

import './globals.css'
export const metadata: Metadata = {
  title: "Pagina del proyecto de AYD 2",
  description: "Proyecto de AYD 2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
