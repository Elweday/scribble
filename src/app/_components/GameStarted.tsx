"use client";
import { unstable_noStore as noStore } from "next/cache";
import DrawingCanvas from "~/app/_components/drawing-canvas";
import { Players } from "~/app/_components/players";
import { TopBar } from "~/app/_components/topbar";
import { Chat } from "~/app/_components/chat";
import { ActorContext } from "~/useGame";


export default function GameStarted() {
  const state = ActorContext.useSelector(state => state);
  const send = ActorContext.useActorRef().send;


  noStore();
  //const data =  game.players.map(player => ({name: player.name, score: 0})).sort((a, b) => b.score - a.score);
  const correct = "apple";
  
  const isMyTurn = true;
  return (
    <main className="w-full h-full  flex-col gap-3 flex">
        <h1 className="lg:text-5xl text-lg lg:pb-8 ">Scribble Game</h1>
        <TopBar correct={correct} isMyTurn={isMyTurn} />
        <div className="flex flex-col-reverse lg:flex-row  gap-3 h-full ">
          <div className="flex lg:contents gap-1 max-h-[40rem]">
            <Players />
            <Chat />
          </div>
            <DrawingCanvas isMyTurn={isMyTurn}/>
        </div>
    </main>
  );
}


