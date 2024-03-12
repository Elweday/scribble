"use client";

import { cn } from "~/utils/cn"
import { Avatar } from "./avatar";
import { useGameSyncedStore } from "~/data/gameStore";
import EditDialog from "./name-dialog";
import { ButtonHTMLAttributes, ElementType, useState } from "react";
import { player } from "~/constants/game";

function EditButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
        <button {...props} className="cursor-pointer">
            <svg className="absolute right-6 top-5 size-7 text-slate-400/80"  xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" ><path fill="currentColor" d="M8 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8m9 0a3 3 0 1 0 0-6a3 3 0 0 0 0 6M4.25 14A2.25 2.25 0 0 0 2 16.25v.25S2 21 8 21s6-4.5 6-4.5v-.25A2.25 2.25 0 0 0 11.75 14zM17 19.5c-1.171 0-2.068-.181-2.755-.458a5.503 5.503 0 0 0 .736-2.207A3.987 3.987 0 0 0 15 16.55v-.3a3.24 3.24 0 0 0-.902-2.248A2.32 2.32 0 0 1 14.2 14h5.6a2.2 2.2 0 0 1 2.2 2.2s0 3.3-5 3.3"></path></svg>
        </button>
    );
}



export const Players = () => {
    const { state } = useGameSyncedStore();
    const [open, setOpen] = useState(false);
    const lobby = state.value == "lobby";
    const players = Object.entries(state.context.players);
    const p = player.use();

    return (
        <div className={cn("flex flex-col w-full lg:gap-3 p-4 max-h-80 rounded-xl gap-1 h-full relative bg-black/10 overflow-y-auto ", {
            "grid grid-cols-2 lg:grid-cols-3": lobby,
            "max-h-96": lobby
        })}>
            {
            open && <EditDialog  />
            }
            {players.length  > 0 ? players.map(([id, {avatar, score, name, guessed}], index) => 
                <div key={index} className={cn("flex place-items-center place-content-start px-2 max-h-24 rounded-2xl  bg-black/10", {
                    "border-2 bg-black/20": id === p.id,
                    "w-full" : lobby
                }) }>
                    <Avatar rank={lobby ? undefined: index + 1} size="large" avatar={avatar} />
                    <p className="flex flex-col place-self-center">
                        <span className={cn("font-bold text-xs lg:text-lg", {
                            "text-green-500":  guessed && !lobby
                        })}>{name}</span>
                        {!lobby ? <span className="text-xs">{score}</span> : null}
                    </p>
                    <EditButton onClick={()=>setOpen(true)} />
                </div>
            ) : 
                <p className="font-bold text-xs lg:text-lg">Waiting for players...</p> }
        </div>
    );
}