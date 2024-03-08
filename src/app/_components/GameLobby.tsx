"use client";
import { unstable_noStore as noStore } from "next/cache";
import { Players } from "~/app/_components/players";
import CopyToClipboard from "../_components/copy-to-clipboard";
import StartGameForm from "./start-game-form";

export default function GameLobby(props: { gameId: string }) {
  
  noStore();
  const url = "http://localhost:3000/" + props.gameId;
  return (
    <main className="place-content-center  place-items-center flex w-full h-full ">
      <div className=" flex  flex-col gap-3 w-full h-fit max-w-3xl p-4 px-12 ">

        <h1 className="text-5xl lg:pb-16 ">Scribble Game</h1>
        <h3 className="-mb-2 w-100">Ask your friends to join using this link</h3>
        <CopyToClipboard copyText={url} />  
              <div className="flex flex-col place-content-center w-full  gap-10 ">
          <Players  />
          <div>   
            <StartGameForm  gameId={props.gameId} />
          </div>

        </div>
    </div>
    </main>
  );
}


