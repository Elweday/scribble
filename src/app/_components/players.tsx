"use client";

import { cn } from "~/utils/cn"
import { Avatar } from "./avatar";
import { useGameSyncedStore } from "~/data/gameStore";

export const Players = () => {
    const { state, me } = useGameSyncedStore();
    const lobby = state.value == "lobby";
    const players = Object.entries(state.context.players)
    return (
        <div className={cn("flex flex-col w-full lg:gap-3 p-4 max-h-80 rounded-xl gap-1 h-full  bg-black/10 overflow-y-auto ", {
            "grid grid-cols-2 lg:grid-cols-3": lobby,
            "max-h-96": lobby
        })}>
            {players.length  > 0 ? players.map(([id, {avatar, score, name, guessed}], index) => 
                <div key={index} className={cn("flex place-items-center place-content-start px-2 max-h-24 rounded-2xl  bg-black/10", {
                    "border-2 bg-black/20": id === me,
                    "w-full" : lobby
                }) }>
                    <Avatar rank={lobby ? undefined: index + 1} size="large" avatar={avatar} />
                    <p className="flex flex-col place-self-center">
                        <span className={cn("font-bold text-xs lg:text-lg", {
                            "text-green-500":  guessed && !lobby
                        })}>{id.slice(0, 5)}</span>
                        {!lobby ? <span className="text-xs">{score}</span> : null}
                    </p>
                </div>
            ) : 
                <p className="font-bold text-xs lg:text-lg">Waiting for players...</p> }
        </div>
    );
}