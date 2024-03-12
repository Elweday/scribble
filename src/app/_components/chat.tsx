"use client";
import  GuessForm from "./guess-form";
import { useGameSyncedStore } from "~/data/gameStore";



export const Chat = () => {
    const { state, me } = useGameSyncedStore();
    const guessers = Object.entries(state.context.players).filter(([_, player]) => player.guessed === true).map(([key]) => key);
    const guessed = state.context.players[me.id]?.guessed 
    const currentWord= state.context?.currentWord;
    const guessesToShow = state.context.guesses.filter(({id}) => !guessers.includes(id) || guessed )
    return (
        <div className="flex flex-col h-full w-full bg-black/10 rounded-xl p-3  justify-between overflow-y-auto max-h-[80%]">
            <ul className="flex flex-col lg:gap-3 gap-1 w-full">
                {guessesToShow.map(({id, word}, index) => (
                    state.context.players[id] && (
                        <li key={index} className="flex gap-1 lg:gap-3">
                            <span className="font-bold text-xs lg:text-lg">{state.context.players[id]?.name}:</span>
                            <span className={ "text-xs lg:text-lg " + (word == currentWord ? "text-green-500": "")}>{word == currentWord ? "Guessed it !" : word}</span>
                        </li>
                    )
                ))}
            </ul>                  
            <GuessForm />

        </div>
    );
}