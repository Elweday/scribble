"use client";
import { unstable_noStore as noStore } from "next/cache";
import { Players } from "~/app/_components/players";
import CopyToClipboard from "../_components/copy-to-clipboard";
import StartGameForm from "./start-game-form";
import { useGameState } from "~/hooks/useGameState";
export default function GameLobby() {
  
  noStore();
  const {  game } = useGameState();
  console.log("players in lobby: ", game.players)
  const gameId = game.gameId;
  const url = "http://localhost:3000/" + gameId;
  return (
    <main className="place-content-center  place-items-center flex w-full h-full ">
      <div className=" flex  flex-col gap-3 w-full h-fit max-w-3xl p-4 px-12 ">

        <h1 className="text-5xl lg:pb-16 ">Scribble</h1>
        <h3 className="-mb-2 w-100">Ask your friends to join using this link</h3>
        <CopyToClipboard copyText={url} />  
              <div className="flex flex-col place-content-center w-full  gap-10 ">
          <Players player="nasser"  />
          <div>   
            <StartGameForm />
          </div>

        </div>
    </div>
    </main>
  );
}


