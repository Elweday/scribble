"use client";
import { cn } from "~/utils/cn";
import  GuessForm from "./guess-form";
import { useGameSyncedStore } from "~/data/gameStore";



export const Chat = () => {
    const { state, me } = useGameSyncedStore();
    const guessers = Object.entries(state.context.players).filter(([_, player]) => player.guessed === true).map(([key]) => key);
    const guessed = state.context.players[me.id]?.guessed 
    const currentWord= state.context?.currentWord;
    const guessesToShow = state.context.guesses.filter(({id}) => !guessers.includes(id) || guessed )
    return (
        <div className="block h-full w-full bg-black/10 rounded-xl p-3  justify-between space-y-3">
            <ul className="flex flex-col-reverse  lg:gap-2   gap-2 w-full  overflow-y-auto  ">
                {guessesToShow.reverse().map(({id, word}, index) => (
                    state.context.players[id] && (
                        <li key={index} className="flex flex-col">
                            <span className="font-bold text-xs scale-75 origin-bottom-left text-slate-400">{state.context.players[id]?.name}</span>
                            <span className={ cn("text-xs lg:text-md ", {
                                "text-green-500": (word == currentWord) || ( state.context.players[id]?.guessed), 
                            })}>{word == currentWord ? "Guessed it !" : word}</span>
                        </li>
                    )
                ))}
            </ul>                  
            <GuessForm />

        </div>
    );
}