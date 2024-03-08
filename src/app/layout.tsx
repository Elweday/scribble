import "~/styles/globals.css";

import { Nunito } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Provider as JotaiProvider } from "jotai";
import { GameProvider } from "~/useGame";





const font = Nunito({ subsets: ["latin"], variable: "--font-family", weight: ["300", "400", "500", "700"] });

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
      <body className={`font-sans ${font.variable} bg-gradient-to-b from-[#66026d] to-[#13162c] text-white   lg:p-16 p-2 h-screen w-full  overflow-hidden`}>
        <TRPCReactProvider>
        <GameProvider>
          <JotaiProvider>
            {children}
          </JotaiProvider>
          </GameProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
