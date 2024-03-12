import "~/styles/globals.css";

import { Macondo } from "next/font/google";

const primary = Macondo({ subsets: ["latin"], variable: "--font-family", weight: [ "400" ] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html style={{fontFamily: primary.style.fontFamily}} className={`h-screen w-screen font-bold`} lang="en">
      <head >
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Wordoodle</title>
        <meta name="description" content="Wordoodle" />
      </head>
      <body className={`font-sans bg-gradient-to-t  from-[#66026d] to-25% to-[#13162c] text-white   lg:p-8 p-2  w-full h-full `}>
            {children}
      </body>
    </html>
  );
}