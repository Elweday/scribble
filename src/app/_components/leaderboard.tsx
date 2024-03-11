"use client";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { useState, useEffect, useContext } from "react";
import { Avatar } from "./avatar";
import { cn } from "~/utils/cn";
import { useGameSyncedStore } from "~/data/gameStore";





export default function Leaderboard() {
  const {state, send} = useGameSyncedStore();
  const players = Object.entries(state.context?.players)
  return (
    <Dialog open={true}>
      <DialogContent className="z-[999] p-5 w-[80%] rounded bg-purple-950/80">
        <DialogHeader>
          <DialogTitle className="flex justify-between place-items-center place-content-center">
            <span className="text-xl ">Leaderboard</span>
          </DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
            <div className=" space-y-0 ">
              
              <p>
                ({players.map(([_, player]) => player.guessed).length} / {players.length})
                The word was <span className="font-bold text-purple-200"> {state.context?.currentWord} </span> 
              </p>

            </div>
            <div className="grid grid-cols-3 gap-2">
                {players.sort(([i1, a], [i2, b]) => b.score - a.score).map(([id, player], index) => (
                  <div className={cn("flex gap-3 place-items-center place-content-center text-center justify-center ", {
                    "col-span-3": index < 1,
                  })} key={index}>
                    <span className="flex flex-col place-content-center ">
                      <Avatar size={index > 0 ? "small" : "large"}  rank={index + 1} avatar={player.avatar} />
                      <div className="flex place-items-center place-content-center">{player.name}</div>
                    </span>
                    
                     <span className=" text-lg font-bold">{player.score}</span>
                    </div>
                ))}
            </div>
            </div>
            {state.value == "done" && 
              <button className="rounded-md bg-white/10 py-2 px-3 place-content-center place-items-center flex font-semibold transition hover:bg-white/20 hover:scale-[1.02]" onClick={() => send({type: "restart_game"})}>Play Again!</button>
            }

            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>)
}