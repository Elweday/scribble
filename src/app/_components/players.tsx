"use client";

import { cn } from "~/utils/cn"
import { State as Game } from "~/constants/game";
import { useGameState } from "~/hooks/useGameState";

interface Props {
    player: string
}

export const Players = (props: Props) => {
    const { player } = props
    const { game } = useGameState()
    const lobby = !game.gameStarted
    const players = game.players
    return (
        <div className={cn("flex flex-col w-full lg:gap-3 p-4  rounded-xl gap-1 h-full bg-black/10 overflow-y-auto", {
            "grid grid-cols-2 lg:grid-cols-3": lobby,
            "max-h-96": lobby
        })}>
            {players.length  > 0 ? players.map(({avatar, score, name}, index) => 
                <div key={index} className={cn("flex place-items-center place-content-center max-h-24 rounded-2xl  bg-black/10", {
                    "bg-green-600/50":  (index == 0 || index == 5) && !lobby,
                    "border-2": name == player,
                    "w-full" : lobby
                }) }>
                    
                    {!lobby ?  <span className="font-bold text-xs lg:text-xl self-center">#{index+1}</span>:null }
                    <img className="lg:size-20 size-10" src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatar}`} alt="avatar" />
                    <p className="flex flex-col place-self-center">
                        <span className="font-bold text-xs lg:text-lg">{name}</span>
                        {!lobby ? <span className="text-xs">{score}</span> : null}
                    </p>
                </div>
            ) : 
                <p className="font-bold text-xs lg:text-lg">Waiting for players...</p> }
        </div>
    );
} 