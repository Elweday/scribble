"use client";
import { unstable_noStore as noStore } from "next/cache";
import DrawingCanvas from "~/app/_components/drawing-canvas";
import { Players } from "~/app/_components/players";
import { TopBar } from "~/app/_components/topbar";
import { Chat } from "~/app/_components/chat";

export default function GameStarted() {
  noStore();
  return (
    <main className="w-full h-full  flex-col gap-3 flex">
        <h1 className="lg:text-5xl text-lg lg:pb-8 ">Wordoodle</h1>
        <TopBar />
        <div className="flex flex-col lg:flex-row  gap-3 h-full ">
        <DrawingCanvas />
          <div className="flex gap-1 flex-grow h-max *:min-w-56">
            <Players />
            <Chat />
          </div>
        </div>
    </main>
  );
}


