"use client";
import { unstable_noStore as noStore } from "next/cache";
import { Players } from "~/app/_components/players";
import CopyToClipboard from "../_components/copy-to-clipboard";
import StartGameForm from "./start-game-form";
import { store } from "~/useGame";

import { useState } from "react";
import { meta } from "~/constants/game";

export default function GameLobby(props: { gameId: string }) {
  
  
  noStore();
  const url = meta.link + props.gameId;
  return (
    
    <main className="place-content-center  place-items-center flex w-full h-full ">
      <div className=" flex  flex-col gap-3 w-full h-fit max-w-3xl p-4 px-12 ">

        <h1 className="text-6xl lg:text-8xl pb-4 lg:pb-16 text-center lg:text-start">{meta.name}</h1>
        <h3 className="-mb-2 w-100">Ask your friends to join using this link</h3>
        <CopyToClipboard copyText={url} />  
        <Players  />
          <div>   
            <StartGameForm  gameId={props.gameId} />
          </div>
    </div>
    </main>
  );
}


