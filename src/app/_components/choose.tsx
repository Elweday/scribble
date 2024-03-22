"use client";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { useGameSyncedStore } from "~/data/gameStore";
import { cn } from "~/utils/cn";
export default function WordChoosing() {
  const {state, send, me, is} = useGameSyncedStore();
  const isMyTurn = is("myturn");
    const choose = (word: string) =>  (e: any) => {
      e.preventDefault();
      send({type:"choose_word", word})
    };
    const name = state.context.players[state.context.currentDrawer] && state.context.players[state.context.currentDrawer]?.name ;

    return is("word_choosing") && (
    <Dialog open={true}>
      <DialogContent  className="z-[999] p-5 w-[80%] rounded bg-purple-950/80">
        <DialogHeader>
          <DialogTitle className="flex justify-between place-items-center place-content-center">
            <span className="text-xl ">Word Choosing</span>
            <span className="flex gap-1 content-center items-center ">
                     <svg xmlns="http://www.w3.org/2000/svg" className={cn("size-6 lg:size-8", {
                        "pr-2 text-red-500" : state.context.word_choosing_time < 5 && state.context.word_choosing_time !== 0    
                     })} viewBox="0 0 24 24"><path fill="currentColor" d="M12 20a8 8 0 0 0 8-8a8 8 0 0 0-8-8a8 8 0 0 0-8 8a8 8 0 0 0 8 8m0-18a10 10 0 0 1 10 10a10 10 0 0 1-10 10C6.47 22 2 17.5 2 12A10 10 0 0 1 12 2m.5 5v5.25l4.5 2.67l-.75 1.23L11 13V7z"/></svg>
                    <span className={cn("font-bold text-2xl", {
                        " animate-spin text-red-500" :state.context.word_choosing_time < 5 && state.context.word_choosing_time !== 0
                    })}>{state.context.word_choosing_time}</span>
            </span>

          </DialogTitle>
          <DialogDescription>
            <span>{(isMyTurn) ? 
            "It's your turn. pick a word to draw.": `Waiting for ${name} to pick a word...`}</span>
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