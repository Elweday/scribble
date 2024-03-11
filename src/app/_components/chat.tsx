"use client";
import  GuessForm from "./guess-form";
import { useGameSyncedStore } from "~/data/gameStore";



export const Chat = () => {
    const {state} = useGameSyncedStore();
    const currentWord= state.context?.currentWord;
    return (
        <div className="flex flex-col h-full w-full bg-black/10 rounded-xl p-3 ">
            <div className="flex  flex-col lg:gap-3 gap-1 w-full h-full max-h-[80%]  overflow-y-auto">
                {state.context.guesses.map(({playerName, word}, index) => (
                    <div key={index} className="flex gap-1 lg:gap-3">
                        <span className="font-bold text-xs lg:text-lg">{playerName}:</span>
                        <span className={ "text-xs lg:text-lg " + (word == currentWord ? "text-green-500": "")}>{word == currentWord ? "Guessed it !" : word}</span>
                    </div>
                ))}
            </div>                  
            <GuessForm />

        </div>
    );
}