"use client";
import  GuessForm from "./guess-form";
import { useState } from "react";
import { api } from "~/trpc/react";
import { type State as Game } from "~/constants/game";
import { type GuessState } from "~/constants/guess";
import { useGameState } from "~/hooks/useGameState";
type Guess = GuessState["guesses"][0]


export const Chat = () => {
    
    const { game} = useGameState()
    const { currentWord, gameId } = game;
    api.guess.subscription.useSubscription({gameId}, {
        onData: (data) => {
            console.log(data)
            const { userId, guess } = data
            const newGuess = {guess,userId, correct: guess === currentWord } as Guess
            setMessages((prev) => [...prev, newGuess])
        },
    });
    
    const [messages, setMessages] = useState<Guess[]>([
        {guess: "First Guess", userId: "Nasser", correct: true}
    ])
    
    return (
        <div className="flex flex-col h-full w-full   bg-black/10 rounded-xl p-3 ">
            <div className="flex flex-col lg:gap-3 gap-1 w-full h-full  overflow-y-auto">
                {messages.map(({userId: sender, guess, correct}, index) => (
                    <div key={index} className="flex gap-1 lg:gap-3">
                        <span className="font-bold text-xs lg:text-lg">{sender}:</span>
                        <span className={ "text-xs lg:text-lg " + (correct ? "text-green-500": "")}>{correct ? "Guessed it !" : guess}</span>
                    </div>
                ))}
            </div>                  
            <GuessForm gameId={gameId} guesser={{name: "Nasser", avatar: ""}} />

        </div>
    );
}