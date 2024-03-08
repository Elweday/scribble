"use client";
import  GuessForm from "./guess-form";
import { useState } from "react";
import { api } from "~/trpc/react";
import { type State as Game } from "~/constants/game";
import { type GuessState } from "~/constants/guess";
import { ActorContext } from "~/useGame";


export const Chat = () => {
    
    const state = ActorContext.useSelector(state => state);
    const { currentWord } = state.context;
/*     api.guess.subscription.useSubscription({gameId}, {
        onData: (data) => {
            console.log(data)
            const { userId, guess } = data
            const newGuess = {guess,userId, correct: guess === currentWord } as Guess
            setMessages((prev) => [...prev, newGuess])
        },
    });
 */    
    
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
            <GuessForm guesser={{name: "Nasser", avatar: ""}} />

        </div>
    );
}