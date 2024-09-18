# Reference

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Sobre el routing

Next usa un sistema de routing basado en el sistema de archivos, por lo que las carpetas representan urls dentro de la aplicación.

La ruta **/** es equivalente a la carpeta **app**, por lo que toda subcarpeta dentro de app sera considerada como una ruta hija.

Esto se repite recursivamente.

Las paginas contendran dos archivos principales: **layout.tsx** que ejecutara al inicio de la carga y aqui iran cosas que deben ser procesadas del lado del servidor.

La ultima pagina en cargarse sera **page.tsx** y debido a que se esta usando el parametro **use client** esta se comporta a efectos practicos como una pagina normal de react.

## API

En la ruta **tools/api.ts** existe una instancia global de axios con configuraciones por defecto y la ruta raiz de la cual deben consumirse todas las llamadas a backend, se debe instanciar esta para hacer los consumos en los componentes.

## Modelos

Los modelos estan dentro de la carpeta **models** y contienen interfaces de typescript que definen las respuestas esperadas o las peticiones a enviar en cada endpoint, asi mismo como estandar existe una interface **IMessageRes** la cual contiene la estructura basica con **msg** para las respuestas de error y demas, esta se usara cuando no se espera mas que un mensaje del backend.
