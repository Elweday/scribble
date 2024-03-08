"use client";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { useState, useEffect } from "react";
import { ActorContext } from "~/useGame";

export default function WordChoosing() {
    const state = ActorContext.useSelector(state => state);
    const send = ActorContext.useActorRef().send
    const choose = (word: string) =>  (e: any) => {
      e.preventDefault();
      send({type:"word_chosen", word})
      setOpen(false);
    };
    const [open, setOpen] = useState(true);
    return (
    <Dialog open={open}>
      <DialogContent  className="z-[999] p-5 w-[80%] rounded bg-purple-950/80">
        <DialogHeader>
          <DialogTitle className="flex justify-between place-items-center place-content-center">
            <span>Pick a word.</span>
          </DialogTitle>
          <DialogDescription>
            <div className="grid grid-cols-3 gap-2">
                {state.context.wordOptions.map((word, index) => (
                    <button key={index} className="rounded-md bg-white/10 py-2 px-3 place-content-center place-items-center flex font-semibold transition hover:bg-white/20 hover:scale-[1.02]" onClick={choose(word)}>{word}</button>
                ))}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>)
}