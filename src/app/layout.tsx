import "~/styles/globals.css";

import { Macondo } from "next/font/google";
import { meta } from "~/constants/game";

const primary = Macondo({ subsets: ["latin"], variable: "--font-family", weight: [ "400" ] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html style={{fontFamily: primary.style.fontFamily}} className={` font-bold font-sans bg-gradient-to-t  from-[#66026d] to-25% to-[#13162c] text-white   lg:p-8 p-2  w-full h-full`} lang="en">
      <head >
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0" />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link rel="icon" href="/favicon.svg" />
        <title>{meta.name}</title>
        <meta name="description" content={meta.description} />
      </head>
      <body className={` w-full h-full overscroll-none`}>
            {children}
      </body>
    </html>
  );
}