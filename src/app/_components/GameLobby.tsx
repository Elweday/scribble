"use client";
import { unstable_noStore as noStore } from "next/cache";
import { Players } from "~/app/_components/players";
import CopyToClipboard from "../_components/copy-to-clipboard";
import StartGameForm from "./start-game-form";
import { store } from "~/useGame";

import { useState } from "react";

export default function GameLobby(props: { gameId: string }) {
  
  
  noStore();
  const url = "http://localhost:3000/" + props.gameId;
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    
    <main className="place-content-center  place-items-center flex w-full h-full ">
      <div className=" flex  flex-col gap-3 w-full h-fit max-w-3xl p-4 px-12 ">
        <pre>
          {JSON.stringify(store.state.context, null, 2)}
        </pre>

        <h1 className="text-7xl lg:pb-16 ">Wordoodle</h1>
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


