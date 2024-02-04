import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Provider as JotaiProvider } from "jotai";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Scribble Clone",
  description: "Scribble Clone",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} bg-gradient-to-b from-[#66026d] to-[#13162c] text-white max-h-screen max-w-screen  lg:p-16 p-2 w-screen h-screen overflow-hidden`}>
        <TRPCReactProvider>
          <JotaiProvider>
            {children}
          </JotaiProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
