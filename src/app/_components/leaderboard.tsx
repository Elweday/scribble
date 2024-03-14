"use client";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
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
              
              <p>
                ({players.map(([_, player]) => player.guessed).length -1 } / {players.length -1})
                The word was <span className="font-bold text-purple-200"> {state.context?.currentWord} </span> 
              </p>

            <div className="flex flex-wrap gap-2">
                {players.sort(([i1, a], [i2, b]) => b.score - a.score).map(([id, player], index) => (
                  <div className={cn("flex gap-3 place-items-center place-content-center text-center justify-center ", {
                  })} key={index}>
                    <span className="flex flex-col place-content-center ">
                      <Avatar size={"xl"}  rank={index + 1} avatar={player.avatar} />
                      <div className="flex place-items-center place-content-center">{player.name}</div>
                     <span className=" text-lg font-bold">{player.score}</span>
                    </span>
                    
                    </div>
                ))}
            </div>
            </div>
            {state.value == "done" && 
              <button className="rounded-md bg-white/10 py-2 px-3 place-content-center place-items-center flex font-semibold transition hover:bg-white/20 hover:scale-[1.02]" onClick={() => send({ type: "start_game", gameId: state.context.gameId })}>Play Again!</button>
            }

            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>)
}