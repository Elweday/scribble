"use client";

import { cn } from "~/utils/cn"
import { Avatar } from "./avatar";
import { useGameSyncedStore } from "~/data/gameStore";
import EditDialog from "./name-dialog";
import { ButtonHTMLAttributes, useState } from "react";
import { player } from "~/constants/game";


import React from 'react';

function EditButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
        <button {...props} className="cursor-pointer justify-self-end ">
            <svg className="" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" ><path fill="currentColor" fillRule="evenodd" d="M14.279 2.152C13.909 2 13.439 2 12.5 2s-1.408 0-1.779.152a2.008 2.008 0 0 0-1.09 1.083c-.094.223-.13.484-.145.863a1.615 1.615 0 0 1-.796 1.353a1.64 1.64 0 0 1-1.579.008c-.338-.178-.583-.276-.825-.308a2.026 2.026 0 0 0-1.49.396c-.318.242-.553.646-1.022 1.453c-.47.807-.704 1.21-.757 1.605c-.07.526.074 1.058.4 1.479c.148.192.357.353.68.555c.477.297.783.803.783 1.361c0 .558-.306 1.064-.782 1.36c-.324.203-.533.364-.682.556a1.99 1.99 0 0 0-.399 1.479c.053.394.287.798.757 1.605c.47.807.704 1.21 1.022 1.453c.424.323.96.465 1.49.396c.242-.032.487-.13.825-.308a1.64 1.64 0 0 1 1.58.008c.486.28.774.795.795 1.353c.015.38.051.64.145.863c.204.49.596.88 1.09 1.083c.37.152.84.152 1.779.152s1.409 0 1.779-.152a2.008 2.008 0 0 0 1.09-1.083c.094-.223.13-.483.145-.863c.02-.558.309-1.074.796-1.353a1.64 1.64 0 0 1 1.579-.008c.338.178.583.276.825.308c.53.07 1.066-.073 1.49-.396c.318-.242.553-.646 1.022-1.453c.47-.807.704-1.21.757-1.605a1.99 1.99 0 0 0-.4-1.479c-.148-.192-.357-.353-.68-.555c-.477-.297-.783-.803-.783-1.361c0-.558.306-1.064.782-1.36c.324-.203.533-.364.682-.556a1.99 1.99 0 0 0 .399-1.479c-.053-.394-.287-.798-.757-1.605c-.47-.807-.704-1.21-1.022-1.453a2.026 2.026 0 0 0-1.49-.396c-.242.032-.487.13-.825.308a1.64 1.64 0 0 1-1.58-.008a1.615 1.615 0 0 1-.795-1.353c-.015-.38-.051-.64-.145-.863a2.007 2.007 0 0 0-1.09-1.083M12.5 15c1.67 0 3.023-1.343 3.023-3S14.169 9 12.5 9c-1.67 0-3.023 1.343-3.023 3s1.354 3 3.023 3" clipRule="evenodd"></path></svg>
        </button>
    );
}

export function KeyIcon() {
	return (
    <svg className="text-yellow-500" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" >
        <path fill="currentColor" d="M7 14c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2m5.6-4c-.8-2.3-3-4-5.6-4c-3.3 0-6 2.7-6 6s2.7 6 6 6c2.6 0 4.8-1.7 5.6-4H16v4h4v-4h3v-4z"></path>
    </svg>
    );

}


export const Players = () => {
    const { state, is } = useGameSyncedStore();
    const [open, setOpen] = useState(false);
    const lobby = state.value == "lobby";
    const players = Object.entries(state.context.players);
    const p = player.use();

    return (
        <div className={cn("flex flex-col  w-full lg:gap-3 p-4   rounded-xl gap-2  relative bg-black/10 overflow-y-auto ", {
            "lg:grid lg:grid-cols-2 max-h-40 lg:max-h-96": lobby
        })}>
            { <EditDialog open={open} setOpen={setOpen}  />}
            {players.length  > 0 ? players.map(([id, {avatar, score, name, guessed}], index) => 
                <div key={index} className={cn("flex place-items-center place-content-start shadow-md justify-between px-2 max-h-24 rounded-2xl  bg-black/10", {
                    "bg-black/20 ring-1 ring-purple-700": id === p.id,
                    "w-full" : lobby
                }) }>
                    <div className="flex">
                    <Avatar rank={lobby ? undefined: index + 1} size="large" avatar={avatar} />
                    <p className="flex flex-col place-self-center">
                        <span className={cn("font-bold text-xs lg:text-md", {
                            "text-green-500":  guessed && !lobby
                        })}>{name}</span>
                        {!lobby ? <span className="text-xs">{score}</span> : null}
                    </p>
                    </div>
                    <div className="flex gap-1">
                    {(id === state.context.owner) &&  <KeyIcon />}
                    {(is("lobby") && id === p.id) &&  <EditButton onClick={()=>setOpen(true)} />}

                    </div>
                    
                </div>
            ) : 
                <p className="font-bold text-xs lg:text-lg">Waiting for players...</p> }
        </div>
    );
}