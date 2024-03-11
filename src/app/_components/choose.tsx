"use client";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { useState, useEffect } from "react";
import { useGameSyncedStore } from "~/data/gameStore";
export default function WordChoosing() {
  const {state, send, me, is} = useGameSyncedStore();
  const isMyTurn = state.context.currentDrawer === me;
    const choose = (word: string) =>  (e: any) => {
      e.preventDefault();
      send({type:"choose_word", word})
      setOpen(false);
      send({type: "start_round"})
    };
    const [open, setOpen] = useState(true);
    useEffect(() => {
      setTimeout(() => {
        if (is("round.running")) return;
        send({type: "pick_random_word"})
        send({type: "start_round" })
      }, 5000)
    }, [])
    return (
    <Dialog open={open}>
      <DialogContent  className="z-[999] p-5 w-[80%] rounded bg-purple-950/80">
        <DialogHeader>
          <DialogTitle className="flex justify-between place-items-center place-content-center">
            <span>{isMyTurn? 
            "Pick a word.": "Waiting for the drawer to pick a word."}</span>
          </DialogTitle>
          <DialogDescription>
          {isMyTurn&& 
            <div className="grid grid-cols-3 gap-2">
                {state.context.wordOptions.map((word, index) => (
                    <button key={index} className="rounded-md bg-white/10 py-2 px-3 place-content-center place-items-center flex font-semibold transition hover:bg-white/20 hover:scale-[1.02]" onClick={choose(word)}>{word}</button>
                ))}
            </div>
          } 
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>)
}